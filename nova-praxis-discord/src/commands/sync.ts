import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { execSync } from 'child_process';
import { getTableCounts } from '../db/queries.js';

export const data = new SlashCommandBuilder()
  .setName('sync')
  .setDescription('[GM] Re-import vault data into the database');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply();

  try {
    execSync('npx tsx scripts/import-all.ts', {
      cwd: process.cwd(),
      timeout: 60_000,
      env: process.env,
    });

    const counts = await getTableCounts();
    const lines = Object.entries(counts)
      .map(([table, count]) => `- **${table}:** ${count} rows`)
      .join('\n');

    await interaction.editReply({
      content: `Data sync complete.\n\n${lines}`,
    });
  } catch (err) {
    await interaction.editReply({
      content: `Sync failed: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}
