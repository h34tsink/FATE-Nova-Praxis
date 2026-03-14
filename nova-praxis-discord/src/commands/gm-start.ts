import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildGmStartContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';

export const data = new SlashCommandBuilder()
  .setName('gm-start')
  .setDescription('[GM] Bootstrap a session — load context, NPCs, scene lineup')
  .addIntegerOption((opt) =>
    opt.setName('session').setDescription('Session number (auto-detects if omitted)').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply();

  const sessionNum = interaction.options.getInteger('session') ?? undefined;

  try {
    const prompt = await buildGmStartContext(sessionNum);
    const result = await callClaude(prompt, 120_000); // longer timeout for session bootstrap
    const embeds = gmResponseEmbed('Session Bootstrap', result.output);
    await interaction.editReply({ embeds });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
