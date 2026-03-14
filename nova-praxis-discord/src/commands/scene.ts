import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildSceneContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('scene')
  .setDescription('[GM] Frame a scene with zones, aspects, NPCs, and compels')
  .addStringOption((opt) =>
    opt.setName('description').setDescription('Scene description or location').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply();

  const description = interaction.options.getString('description', true);

  try {
    const prompt = await buildSceneContext(description);
    const result = await callClaude(prompt);
    const embeds = gmResponseEmbed('Scene', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
