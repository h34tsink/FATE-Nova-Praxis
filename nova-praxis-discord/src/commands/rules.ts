import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildRulesContext } from '../claude/context.js';
import { gmResponseEmbed, rulesEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('rules')
  .setDescription('[GM] Look up game rules')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Rules question').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const question = interaction.options.getString('question', true);

  // Try fast path first
  const { fastAnswer, fullPrompt } = await buildRulesContext(question);

  if (fastAnswer) {
    // Fast pg result — no deferral needed
    const parts = fastAnswer.split('\n\n**Source:**');
    const answer = parts[0];
    const source = parts[1]?.trim() || 'Indexed rules';
    await interaction.reply({ embeds: [rulesEmbed(answer, source)] });
    return;
  }

  // Escalate to Claude CLI
  await interaction.deferReply();

  try {
    const result = await callClaude(fullPrompt);
    const embeds = gmResponseEmbed('Rules', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
