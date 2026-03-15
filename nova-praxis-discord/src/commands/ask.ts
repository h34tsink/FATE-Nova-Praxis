import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { searchGameData, searchGlossary, searchRules, getEntityCard, getEntityCardByName } from '../db/queries.js';
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

  // Search game data (gear, augmentations, etc.)
  const gameResults = await searchGameData(question);
  if (gameResults.length > 0) {
    const items = gameResults.slice(0, 3).map((r) => {
      const meta = r.metadata ? JSON.stringify(r.metadata) : '';
      return `**${r.name}** [${r.category}]: ${r.description || ''}\n${meta}`;
    });
    sections.push(`## Game Data\n${items.join('\n\n')}`);
  }

  // Search glossary
  const glossaryResults = await searchGlossary(question);
  if (glossaryResults.length > 0) {
    const terms = glossaryResults.slice(0, 3).map((r) =>
      `**${r.term}**: ${r.short_def || r.long_def || ''}`
    );
    sections.push(`## Glossary\n${terms.join('\n\n')}`);
  }

  // Search rules
  const rulesResults = await searchRules(question);
  if (rulesResults.length > 0) {
    const rules = rulesResults.slice(0, 3).map((r) =>
      `**${r.heading}** (${r.file_path}):\n${r.content.slice(0, 500)}`
    );
    sections.push(`## Rules\n${rules.join('\n\n')}`);
  }

  // Check for NPC mentions and load entity cards
  for (const token of NPC_TOKENS) {
    if (lowerQ.includes(token)) {
      const card = await getEntityCard(token) || await getEntityCardByName(token);
      if (card) {
        sections.push(`## Entity Card: ${card.name}\n${card.full_card}`);
        break; // one card is usually enough
      }
    }
  }

  return sections.join('\n\n---\n\n');
}

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!(await requireGM(interaction))) return;

  const question = interaction.options.getString('question', true);

  try {
    const context = await gatherContext(question);

    const prompt = `You are a Nova Praxis TTRPG assistant. Answer the following question using ONLY the provided context. If the context doesn't contain enough information, say so. Be concise and direct.

## Context from Database
${context || 'No relevant context found in the database.'}

## Question
${question}

Answer concisely. If this is about an NPC, stay in-world. If about rules or gear, cite specifics.

Format for Discord: use **bold**, *italic*, \`code\`, and > blockquotes. Use markdown tables for structured data. Keep it scannable.`;

    const result = await callClaude(prompt);
    const embeds = gmResponseEmbed('Ask', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
