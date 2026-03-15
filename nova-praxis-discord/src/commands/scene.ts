import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildSceneContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('scene')
  .setDescription('[GM] Frame a scene with zones, aspects, NPCs, and compels')
  .addStringOption((opt) =>
    opt.setName('description').setDescription('Scene description or location').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  if (!(await requireGM(interaction))) return;

  const description = interaction.options.getString('description', true);

  try {
    const prompt = await buildSceneContext(description);
    const result = await callClaude(prompt);
    const customId = cacheForShare('Scene', result.output, interaction.user.id);
    const embeds = gmResponseEmbed('Scene', result.output);
    await interaction.editReply({ embeds, components: [shareButton(customId)] });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
