import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { isGM } from '../middleware/permissions.js';
import { streamApi } from '../claude/api.js';
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
    const result = await streamApi(prompt, 'fast', undefined, async (text) => {
      const embeds = gm ? gmResponseEmbed('Recap', text) : playerResponseEmbed('Recap', text);
      await interaction.editReply({ embeds }).catch(() => {});
    });
    if (gm) {
      const customId = cacheForShare('Recap', result.output, interaction.user.id);
      await interaction.editReply({ embeds: gmResponseEmbed('Recap', result.output), components: [shareButton(customId)] });
    } else {
      await interaction.editReply({ embeds: playerResponseEmbed('Recap', result.output) });
    }
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
