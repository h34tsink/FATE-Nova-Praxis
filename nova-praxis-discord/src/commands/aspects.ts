import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildAspectsContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';

export const data = new SlashCommandBuilder()
  .setName('aspects')
  .setDescription('[GM] Generate FATE Aspects for a scene, NPC, consequence, etc.')
  .addStringOption((opt) =>
    opt.setName('subject').setDescription('What to generate aspects for').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const subject = interaction.options.getString('subject', true);

  try {
    const prompt = await buildAspectsContext(subject);
    const result = await callClaude(prompt);
    const customId = cacheForShare('Aspects', result.output, interaction.user.id);
    const embeds = gmResponseEmbed('Aspects', result.output);
    await interaction.editReply({ embeds, components: [shareButton(customId)] });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
