import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { requireGM } from '../middleware/permissions.js';
import { spawn } from 'child_process';
import { getTableCounts } from '../db/queries.js';

export const data = new SlashCommandBuilder()
  .setName('sync')
  .setDescription('[GM] Re-import vault data into the database');

function runImport(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['tsx', 'scripts/import-all.ts'], {
      cwd: process.cwd(),
      shell: true,
      timeout: 60_000,
      env: process.env,
    });

    let stderr = '';
    proc.stderr.on('data', (data) => { stderr += data.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `Import exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply();

  try {
    await runImport();

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
