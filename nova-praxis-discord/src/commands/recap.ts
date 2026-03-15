import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { isGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildRecapContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { playerResponseEmbed } from '../embeds/player-response.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('recap')
  .setDescription('Get current session state summary');

export async function execute(interaction: ChatInputCommandInteraction) {
  const gm = isGM(interaction);

  await interaction.deferReply({ ephemeral: gm });

  try {
    const prompt = await buildRecapContext();
    const result = await callClaude(prompt);
    if (gm) {
      const customId = cacheForShare('Recap', result.output, interaction.user.id);
      const embeds = gmResponseEmbed('Recap', result.output);
      await interaction.editReply({ embeds, components: [shareButton(customId)] });
    } else {
      const embeds = playerResponseEmbed('Recap', result.output);
      await interaction.editReply({ embeds });
    }
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
