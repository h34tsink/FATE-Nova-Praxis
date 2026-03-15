import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { isGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildRulesContext } from '../claude/context.js';
import { gmResponseEmbed, rulesEmbed } from '../embeds/gm-response.js';
import { playerResponseEmbed } from '../embeds/player-response.js';

export const data = new SlashCommandBuilder()
  .setName('rules')
  .setDescription('Look up game rules')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Rules question').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const gm = isGM(interaction);

  // Try fast path first
  const { fastAnswer, fullPrompt } = await buildRulesContext(question);

  if (fastAnswer) {
    const parts = fastAnswer.split('\n\n**Source:**');
    const answer = parts[0];
    const source = parts[1]?.trim() || 'Indexed rules';
    await interaction.reply({
      embeds: [rulesEmbed(answer, source)],
      ephemeral: gm,
    });
    return;
  }

  // Escalate to Claude CLI
  await interaction.deferReply({ ephemeral: gm });

  try {
    const result = await callClaude(fullPrompt);
    const embeds = gm
      ? gmResponseEmbed('Rules', result.output)
      : playerResponseEmbed('Rules', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
