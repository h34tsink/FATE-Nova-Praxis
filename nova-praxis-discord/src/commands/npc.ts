import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildNpcContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('npc')
  .setDescription('[GM] Generate NPC dialogue')
  .addStringOption((opt) =>
    opt.setName('token').setDescription('NPC token (e.g., nowak, kestrel)').setRequired(true)
  )
  .addStringOption((opt) =>
    opt.setName('situation').setDescription('Scene context or player question').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply();

  const token = interaction.options.getString('token', true);
  const situation = interaction.options.getString('situation') || '';

  try {
    const prompt = await buildNpcContext(token, situation);
    const result = await callClaude(prompt);
    const embeds = gmResponseEmbed(`NPC: ${token}`, result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
