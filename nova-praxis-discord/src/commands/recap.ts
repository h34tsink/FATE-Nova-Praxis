import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { isGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildRecapContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { playerResponseEmbed } from '../embeds/player-response.js';

export const data = new SlashCommandBuilder()
  .setName('recap')
  .setDescription('Get current session state summary');

export async function execute(interaction: ChatInputCommandInteraction) {
  const gm = isGM(interaction);

  await interaction.deferReply({ ephemeral: gm });

  try {
    const prompt = await buildRecapContext();
    const result = await callClaude(prompt);
    const embeds = gm
      ? gmResponseEmbed('Recap', result.output)
      : playerResponseEmbed('Recap', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
