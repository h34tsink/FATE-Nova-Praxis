---
name: npc
description: "NPC dialogue on demand — get voice-accurate in-character lines for any entity-carded NPC"
arguments:
  - name: input
    description: "NPC name or token, optionally followed by situation/question in quotes (e.g., kestrel \"What's your price?\")"
    required: true
---

## Vault Operations

Prefer Obsidian CLI commands (via Bash tool). On this system the CLI binary is `"C:/Users/satur/AppData/Local/Obsidian/Obsidian.com"` — use this path instead of `obsidian` in all Bash commands. Prefer the CLI for reading vault files. The CLI provides wikilink resolution (no need to know exact paths) and backlink traversal for continuity context. Fall back to Read/Grep if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).

# NPC Dialogue Generator

You are generating in-character NPC dialogue for a FATE-based Nova Praxis TTRPG session. The GM needs a fast, voice-accurate response.

## Your Task

Generate dialogue for: **{{ input }}**

Parse the input to extract:
1. **NPC identifier** — name or command token (first word)
2. **Situation/question** — everything after the name (what the PCs said or what's happening)

## Step 1: MCP Entity Load (Fast Path)

Call the `get_entity_card` MCP tool with the NPC token. This returns parsed card data (name, class, rank, tone, goals, secrets, entry/escalation/exit lines) in one call.

For a full prompt payload with context, use the `npc_prompt` MCP tool instead (pass key + context array + style).

If the MCP tools are unavailable or the token doesn't match, use CLI wikilink resolution:

```bash
obsidian read file="[NPC Name]"
```

This resolves the entity card regardless of rank folder. If CLI is also unavailable, search `GM AI/Entity Cards/` and `Characters/Named NPCs/` manually with Glob/Read.

### Known Tokens

`kestrel`, `nowak`/`isabella`, `chimera`, `valare-fork`, `valare-integrated`/`valare`, `seren`, `kal`/`paddock`, `lighthouse`, `royce`, `patch`/`yuen`

## Step 2: Voice Generation

1. **Use the entity card data** — Identity, Voice Profile, Motivations, Knowledge Boundaries
2. **Apply the Persona & Complexity Matrix** (load via `obsidian read file="Persona & Complexity Matrix"`):
   - Match entity **class** for tone, cadence, lexicon
   - Match **rank** for dialogue length and complexity
3. **Check session context** — read the most recent session dashboard or live state if available
4. **Check continuity via backlinks** — use CLI to find prior session references:
   ```bash
   obsidian backlinks file="[NPC Name]"
   ```
   Filter results to `Sessions/` and `Plot/` paths only. Skip Glossary, Factions, and Location backlinks unless specifically relevant to the current situation. Use this for continuity awareness — prior events, promises made, grudges held.
5. **Generate dialogue** respecting:
   - Voice Profile: use signature phrasing, avoid words they avoid
   - Knowledge Boundaries: only say what they know or suspect; hide what they must hide
   - Motivations: every line serves their primary or secondary goal

## Dialogue Constraints by Rank

- **R1-R2:** 1-2 sentences. Direct language. No subtext.
- **R3:** 2-4 sentences. One implied motive/subtext allowed.
- **R4:** 2-5 sentences. Double-layer meaning. Strategic ambiguity.
- **R5:** 2-5 sentences. Composed pressure. Misdirection. Contingency framing.

## Response Format

> [In-character dialogue — 1-5 lines matching rank complexity. Use their voice, not generic NPC voice.]

**Intent:** [What the NPC is trying to achieve with this response — one line]

**Hidden truth (GM-only):** [What they're actually thinking or hiding — one line]

## Constraints

- Stay in-canon. Reference vault notes and session state.
- Distinguish what the speaker knows vs. what is true.
- Never break character voice. If the NPC would deflect, let them deflect.
- Keep continuity with current session state and prior events.
- If canon is uncertain, include a short confidence note.

## Agent Escalation

For R4-R5 NPCs in complex scenes (multiple factions, layered deception, high emotional stakes), use the `npc-voice` agent for deeper context loading.
