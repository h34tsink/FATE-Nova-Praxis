import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callApi, extractSearchTerms } from '../claude/api.js';
import { searchGameData, searchGlossary, searchRules, searchSessions, getEntityCard, getEntityCardByName, type GlossaryRow } from '../db/queries.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('ask')
  .setDescription('[GM] Ask anything about the game world, rules, NPCs, or gear')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Your question in natural language').setRequired(true)
  );

// Known NPC tokens/names for context detection
const NPC_TOKENS = [
  'kestrel', 'nowak', 'isabella', 'chimera', 'valare', 'valare_fork',
  'valare_integrated', 'seren', 'kal', 'paddock', 'lighthouse', 'royce',
  'patch', 'yuen', 'mira', 'nola', 'sera', 'udo', 'declan', 'joss', 'taban',
];

async function gatherContext(question: string): Promise<string> {
  const sections: string[] = [];
  const lowerQ = question.toLowerCase();

  // Use Haiku to expand the question into better search terms
  const searchTerms = await extractSearchTerms(question);
  const allQueries = [question, ...searchTerms];

  // Run all searches in parallel across all expanded terms
  const [gameResults, glossaryResults, rulesResults, sessionResults] = await Promise.all([
    dedupeSearches(allQueries, (q) => searchGameData(q)),
    dedupeGlossary(allQueries),
    dedupeSearches(allQueries, (q) => searchRules(q)),
    dedupeSearches(allQueries, (q) => searchSessions(q)),
  ]);

  if (gameResults.length > 0) {
    const items = gameResults.slice(0, 3).map((r) => {
      const meta = r.metadata ? JSON.stringify(r.metadata) : '';
      return `**${r.name}** [${r.category}]: ${r.description || ''}\n${meta}`;
    });
    sections.push(`## Game Data\n${items.join('\n\n')}`);
  }

  if (glossaryResults.length > 0) {
    const terms = glossaryResults.slice(0, 3).map((r) =>
      `**${r.term}**: ${r.short_def || r.long_def || ''}`
    );
    sections.push(`## Glossary\n${terms.join('\n\n')}`);
  }

  if (rulesResults.length > 0) {
    const rules = rulesResults.slice(0, 5).map((r) =>
      `**${r.heading}** (${r.file_path}):\n${r.content.slice(0, 800)}`
    );
    sections.push(`## Rules\n${rules.join('\n\n')}`);
  }

  if (sessionResults.length > 0) {
    const sessions = sessionResults.slice(0, 4).map((r) =>
      `**${r.heading}** [Session ${r.session_num}, ${r.file_type ?? 'notes'}]:\n${r.content.slice(0, 800)}`
    );
    sections.push(`## Session Notes\n${sessions.join('\n\n')}`);
  }

  // Check for NPC mentions and load entity cards
  for (const token of NPC_TOKENS) {
    if (lowerQ.includes(token)) {
      const card = await getEntityCard(token) || await getEntityCardByName(token);
      if (card) {
        sections.push(`## Entity Card: ${card.name}\n${card.full_card}`);
        break;
      }
    }
  }

  return sections.join('\n\n---\n\n');
}

/** Run a ranked search across multiple query terms, deduplicate by id. */
async function dedupeSearches<T extends { id: number; rank: number }>(
  queries: string[],
  searchFn: (q: string) => Promise<T[]>
): Promise<T[]> {
  const results = await Promise.all(queries.map(searchFn));
  const seen = new Map<number, T>();
  for (const batch of results) {
    for (const r of batch) {
      const existing = seen.get(r.id);
      if (!existing || r.rank > existing.rank) seen.set(r.id, r);
    }
  }
  return [...seen.values()].sort((a, b) => b.rank - a.rank);
}

/** Glossary doesn't have rank in its base type — dedupe by id only. */
async function dedupeGlossary(queries: string[]): Promise<GlossaryRow[]> {
  const results = await Promise.all(queries.map((q) => searchGlossary(q)));
  const seen = new Map<number, GlossaryRow>();
  for (const batch of results) {
    for (const r of batch) {
      if (!seen.has(r.id)) seen.set(r.id, r);
    }
  }
  return [...seen.values()];
}

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!(await requireGM(interaction))) return;

  const question = interaction.options.getString('question', true);

  try {
    const context = await gatherContext(question);

    const prompt = `You are a Nova Praxis TTRPG assistant with deep knowledge of the setting, rules, and this campaign's ongoing story. Answer the question using the provided context as your primary source. If the context is thin, draw on your Nova Praxis and FATE system knowledge — but flag it as general knowledge rather than campaign-specific.

## Context from Database
${context || 'No relevant context found in the database.'}

## Question
${question}

Answer concisely and directly. If this is about an NPC, stay in-world. If about rules or gear, cite specifics. If about a session or scenario, use the session notes above.

Format for Discord: use **bold**, *italic*, \`code\`, and > blockquotes. Use markdown tables for structured data. Keep it scannable.`;

    const result = await callApi(prompt, 'quality');
    const embeds = gmResponseEmbed('Ask', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
