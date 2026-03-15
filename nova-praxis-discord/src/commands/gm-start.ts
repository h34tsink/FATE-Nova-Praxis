import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callApi } from '../claude/api.js';
import { buildGmStartContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('gm-start')
  .setDescription('[GM] Bootstrap a session — load context, NPCs, scene lineup')
  .addIntegerOption((opt) =>
    opt.setName('session').setDescription('Session number (auto-detects if omitted)').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!(await requireGM(interaction))) return;

  const sessionNum = interaction.options.getInteger('session') ?? undefined;

  try {
    const prompt = await buildGmStartContext(sessionNum);
    const result = await callApi(prompt, 'quality', 4096);
    const customId = cacheForShare('Session Bootstrap', result.output, interaction.user.id);
    const embeds = gmResponseEmbed('Session Bootstrap', result.output);
    await interaction.editReply({ embeds, components: [shareButton(customId)] });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
