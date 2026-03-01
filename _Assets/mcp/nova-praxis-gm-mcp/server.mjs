import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_ROOT = path.resolve(__dirname, "..", "..", "..");
const STATE_PATH = path.join(VAULT_ROOT, "_Assets", "Scripts", "np-gm-state.json");

const ENTITY_CARD_MAP = {
  kestrel: "GM AI/Entity Cards/R4/Kestrel (R4 Important NPC).md",
  nowak: "GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC).md",
  isabella: "GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC).md",
  chimera: "GM AI/Entity Cards/R5/Chimera (R5 Villain).md",
  "valare-fork": "GM AI/Entity Cards/R4/Valare Fork (R4 Important NPC).md",
  "valare-integrated": "GM AI/Entity Cards/R4/Valare Integrated (R4 Personal Agent Ally).md",
  seren: "GM AI/Entity Cards/R3/Seren (R3 Important Contact).md",
  kal: "GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact).md",
  paddock: "GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact).md",
  lighthouse: "GM AI/Entity Cards/R3/Lighthouse Tactical Controller (R3 Systems Agent).md"
};

const RULE_SOURCE_PRIORITY = [
  "Nova Praxis Rulebook (Cleaned).txt",
  "pdf_full_extract.txt",
  "Rules and Mechanics",
  "Data",
  "Glossary"
];

function readFileSafe(absPath) {
  if (!fs.existsSync(absPath)) {
    return null;
  }

  return fs.readFileSync(absPath, "utf8");
}

function readJsonSafe(absPath, fallback) {
  try {
    if (!fs.existsSync(absPath)) {
      return fallback;
    }

    const raw = fs.readFileSync(absPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeLine(value) {
  return (value || "").trim().replace(/^"|"$/g, "");
}

function getCardField(cardText, label, fallback = "") {
  const pattern = new RegExp(`-\\s*${label}:\\s*(.+)$`, "im");
  const match = cardText.match(pattern);
  if (!match) {
    return fallback;
  }

  return normalizeLine(match[1]);
}

function getSessionState() {
  const fallback = {
    activeNpc: "",
    objective: "",
    scene: [],
    updatedAt: ""
  };

  const state = readJsonSafe(STATE_PATH, fallback);
  if (!Array.isArray(state.scene)) {
    state.scene = [];
  }

  return state;
}

function getEntityCardRaw(key) {
  const npcKey = (key || "").trim().toLowerCase();
  const relPath = ENTITY_CARD_MAP[npcKey];
  if (!relPath) {
    const knownKeys = Object.keys(ENTITY_CARD_MAP).sort();
    throw new Error(`Unknown NPC key '${key}'. Known keys: ${knownKeys.join(", ")}`);
  }

  const absPath = path.join(VAULT_ROOT, relPath);
  const raw = readFileSafe(absPath);
  if (!raw) {
    throw new Error(`Entity card not found at ${relPath}`);
  }

  return { key: npcKey, relPath, absPath, raw };
}

function parseEntityCard(key) {
  const { key: npcKey, relPath, raw } = getEntityCardRaw(key);
  return {
    key: npcKey,
    path: relPath,
    name: getCardField(raw, "Name", npcKey),
    class: getCardField(raw, "Class", "Important NPC"),
    rank: getCardField(raw, "Complexity Rank", "R3"),
    tone: getCardField(raw, "Baseline tone"),
    cadence: getCardField(raw, "Cadence"),
    primaryGoal: getCardField(raw, "Primary goal"),
    secondaryGoal: getCardField(raw, "Secondary goal"),
    pressurePoint: getCardField(raw, "Fear\\s*/\\s*pressure point"),
    redLine: getCardField(raw, "Red line"),
    mustHide: getCardField(raw, "Must hide"),
    entryLine: getCardField(raw, "Entry line"),
    escalationLine: getCardField(raw, "Escalation line"),
    exitLine: getCardField(raw, "Exit line")
  };
}

function buildNpcPrompt({ key, context = [], goalOverride = "", secretOverride = "", style = "table-short" }) {
  const card = parseEntityCard(key);
  const lines = (Array.isArray(context) ? context : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, 3);

  const contextLines = lines.length > 0 ? lines : ["[scene context missing]"];
  const goal = goalOverride || card.primaryGoal || "[goal]";
  const secret = secretOverride || card.mustHide || "[secret]";

  const styleValue = String(style || "table-short").toLowerCase();
  const lengthRule =
    styleValue === "gm-deep"
      ? "Keep response concise (2-6 lines)."
      : "Keep response concise (1-2 lines).";

  const intentRule =
    styleValue === "gm-deep"
      ? "Include Intent and one GM Note line after dialogue."
      : "Include one Intent line after dialogue.";

  const contextBlock = contextLines.map((item) => `- ${item}`).join("\n");

  return `You are speaking as: **${card.name}**.
Entity class: **${card.class}**.
Complexity rank: **${card.rank}**.
Current context:
${contextBlock}
What this entity wants right now: **${goal}**.
What they must avoid revealing: **${secret}**.

Constraints:
- Stay in-canon using vault notes and extracted PDFs.
- ${lengthRule}
- Match speech style for class + rank.
- ${intentRule}

Return:
1) In-character response
2) Intent: ...
3) GM Note: ... (only if style is gm-deep)`;
}

function keywordize(question) {
  const stop = new Set([
    "what",
    "which",
    "where",
    "when",
    "why",
    "how",
    "does",
    "with",
    "from",
    "into",
    "that",
    "this",
    "have",
    "has",
    "for",
    "and",
    "the",
    "are"
  ]);

  return String(question || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stop.has(token));
}

function collectFiles(rootPath) {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const stat = fs.statSync(rootPath);
  if (stat.isFile()) {
    return [rootPath];
  }

  const out = [];
  const stack = [rootPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (/\.(md|txt|ts)$/i.test(entry.name)) {
        out.push(fullPath);
      }
    }
  }

  return out;
}

function findMatches(absPath, keywords, maxLines = 4) {
  const raw = readFileSafe(absPath);
  if (!raw) {
    return [];
  }

  const lines = raw.split(/\r?\n/);
  const matches = [];

  for (let index = 0; index < lines.length; index++) {
    const lower = lines[index].toLowerCase();
    if (!keywords.some((k) => lower.includes(k))) {
      continue;
    }

    const cleaned = lines[index].trim();
    if (!cleaned) {
      continue;
    }

    matches.push({
      line: index + 1,
      text: cleaned.slice(0, 220)
    });

    if (matches.length >= maxLines) {
      break;
    }
  }

  return matches;
}

function rulesLookup(question) {
  const keywords = keywordize(question);
  const sections = [];

  for (const source of RULE_SOURCE_PRIORITY) {
    const abs = path.join(VAULT_ROOT, source);
    const files = collectFiles(abs);
    const perSource = [];

    for (const file of files) {
      const hits = findMatches(file, keywords, 3);
      if (hits.length === 0) {
        continue;
      }

      perSource.push({
        file: path.relative(VAULT_ROOT, file).replace(/\\/g, "/"),
        hits
      });

      if (perSource.length >= 3) {
        break;
      }
    }

    if (perSource.length > 0) {
      sections.push({ source, files: perSource });
    }
  }

  return {
    question,
    sourcePriority: RULE_SOURCE_PRIORITY,
    guidance:
      "Use Rules Adjudication Mode format: Answer, Exceptions/Modifiers, Source files checked, Confidence.",
    sections
  };
}

function getScopePaths(scope = "core") {
  const normalized = String(scope || "core").toLowerCase();
  switch (normalized) {
    case "rules":
      return ["Nova Praxis Rulebook (Cleaned).txt", "pdf_full_extract.txt", "Rules and Mechanics", "Data"];
    case "lore":
      return ["Factions", "Glossary", "Locations", "Campaign Overview", "machinations_full_extract.txt"];
    case "session":
      return ["Sessions", "Plot", "Campaign Overview"];
    case "full":
      return [
        "Nova Praxis Rulebook (Cleaned).txt",
        "pdf_full_extract.txt",
        "machinations_full_extract.txt",
        "GM AI",
        "Rules and Mechanics",
        "Factions",
        "Locations",
        "Sessions",
        "Campaign Overview",
        "Data"
      ];
    default:
      return ["GM AI", "Sessions", "Rules and Mechanics", "Data", "Campaign Overview"];
  }
}

function vaultSearch({ query, scope = "core", maxResults = 8 }) {
  const keywords = keywordize(query);
  const files = getScopePaths(scope)
    .flatMap((rel) => collectFiles(path.join(VAULT_ROOT, rel)));

  const results = [];

  for (const abs of files) {
    const hits = findMatches(abs, keywords, 2);
    if (hits.length === 0) {
      continue;
    }

    results.push({
      file: path.relative(VAULT_ROOT, abs).replace(/\\/g, "/"),
      hits
    });

    if (results.length >= maxResults) {
      break;
    }
  }

  return {
    query,
    scope,
    resultCount: results.length,
    results
  };
}

function textResult(text) {
  return {
    content: [{ type: "text", text }]
  };
}

const server = new Server(
  {
    name: "nova-praxis-gm-mcp",
    version: "0.1.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_session_state",
        description: "Read current GM session state from _Assets/Scripts/np-gm-state.json",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "list_entity_keys",
        description: "List available NPC/entity keys",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false
        }
      },
      {
        name: "get_entity_card",
        description: "Load and parse an entity card by key",
        inputSchema: {
          type: "object",
          properties: {
            key: { type: "string" }
          },
          required: ["key"],
          additionalProperties: false
        }
      },
      {
        name: "npc_prompt",
        description: "Generate an in-character prompt payload from an entity card",
        inputSchema: {
          type: "object",
          properties: {
            key: { type: "string" },
            context: { type: "array", items: { type: "string" } },
            goalOverride: { type: "string" },
            secretOverride: { type: "string" },
            style: { type: "string", enum: ["table-short", "gm-deep"] }
          },
          required: ["key"],
          additionalProperties: false
        }
      },
      {
        name: "rules_lookup",
        description:
          "Search prioritized Nova Praxis rule sources and return matched snippets for adjudication",
        inputSchema: {
          type: "object",
          properties: {
            question: { type: "string" }
          },
          required: ["question"],
          additionalProperties: false
        }
      },
      {
        name: "vault_search",
        description: "Keyword search across scoped vault paths",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            scope: { type: "string", enum: ["core", "rules", "lore", "session", "full"] },
            maxResults: { type: "number", minimum: 1, maximum: 25 }
          },
          required: ["query"],
          additionalProperties: false
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    if (name === "get_session_state") {
      return textResult(JSON.stringify(getSessionState(), null, 2));
    }

    if (name === "list_entity_keys") {
      return textResult(JSON.stringify({ keys: Object.keys(ENTITY_CARD_MAP).sort() }, null, 2));
    }

    if (name === "get_entity_card") {
      return textResult(JSON.stringify(parseEntityCard(args.key), null, 2));
    }

    if (name === "npc_prompt") {
      const text = buildNpcPrompt({
        key: args.key,
        context: args.context,
        goalOverride: args.goalOverride,
        secretOverride: args.secretOverride,
        style: args.style
      });
      return textResult(text);
    }

    if (name === "rules_lookup") {
      return textResult(JSON.stringify(rulesLookup(args.question), null, 2));
    }

    if (name === "vault_search") {
      return textResult(
        JSON.stringify(
          vaultSearch({
            query: args.query,
            scope: args.scope,
            maxResults: args.maxResults
          }),
          null,
          2
        )
      );
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
