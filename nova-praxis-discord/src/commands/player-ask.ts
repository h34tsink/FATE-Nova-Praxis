import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { streamApi } from '../claude/api.js';
import { searchGameData, searchGlossary, searchRules } from '../db/queries.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('player-ask')
  .setDescription('Ask about game world, rules, gear, or lore (player-safe)')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Your question').setRequired(true)
  );

async function gatherPlayerContext(question: string): Promise<string> {
  const sections: string[] = [];

  // Game data (gear, augmentations, skills, etc.) — all player-safe
  const gameResults = await searchGameData(question);
  if (gameResults.length > 0) {
    const items = gameResults.slice(0, 3).map((r) => {
      const meta = r.metadata ? JSON.stringify(r.metadata) : '';
      return `**${r.name}** [${r.category}]: ${r.description || ''}\n${meta}`;
    });
    sections.push(`## Game Data\n${items.join('\n\n')}`);
  }

  // Glossary — all player-safe
  const glossaryResults = await searchGlossary(question);
  if (glossaryResults.length > 0) {
    const terms = glossaryResults.slice(0, 3).map((r) =>
      `**${r.term}**: ${r.short_def || r.long_def || ''}`
    );
    sections.push(`## Glossary\n${terms.join('\n\n')}`);
  }

  // Rules — player-safe (no hidden GM mechanics)
  const rulesResults = await searchRules(question);
  if (rulesResults.length > 0) {
    const rules = rulesResults.slice(0, 3).map((r) =>
      `**${r.heading}** (${r.file_path}):\n${r.content.slice(0, 500)}`
    );
    sections.push(`## Rules\n${rules.join('\n\n')}`);
  }

  // NO entity cards — those contain hidden truths, motivations, knowledge boundaries

  return sections.join('\n\n---\n\n');
}

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const question = interaction.options.getString('question', true);

  try {
    const context = await gatherPlayerContext(question);

    const prompt = `You are a Nova Praxis TTRPG reference assistant answering a PLAYER's question. Use ONLY the provided context.

IMPORTANT RESTRICTIONS — you are answering a PLAYER, not the GM:
- Do NOT reveal NPC motivations, hidden agendas, or secret knowledge
- Do NOT reveal GM-only plot information
- Answer only what a player character could reasonably know or look up
- Stick to publicly available lore, game mechanics, gear stats, and rules
- If the question asks about NPC secrets or hidden plot details, say "That's something you'd need to discover in-game."

## Context from Database
${context || 'No relevant context found.'}

## Player's Question
${question}

Answer concisely. Use **bold**, *italic*, \`code\`, and markdown tables for structured data. Keep it scannable.`;

    const result = await streamApi(prompt, 'fast', undefined, async (text) => {
      const embeds = gmResponseEmbed('Answer', text);
      for (const embed of embeds) { embed.setFooter({ text: 'Contextual' }); embed.setColor(0x5865f2); }
      await interaction.editReply({ embeds }).catch(() => {});
    });
    const embeds = gmResponseEmbed('Answer', result.output);
    for (const embed of embeds) { embed.setFooter({ text: 'Contextual' }); embed.setColor(0x5865f2); }
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
