import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const CHAR_DIR = join(VAULT, 'Characters', 'Players', 'player-json');

async function main() {
  console.log('Importing player characters...');
  await query('TRUNCATE characters RESTART IDENTITY');

  const files = readdirSync(CHAR_DIR).filter((f) => f.endsWith('.json'));
  let count = 0;

  for (const file of files) {
    const raw = readFileSync(join(CHAR_DIR, file), 'utf-8');
    const parsed = JSON.parse(raw);

    const character = parsed.character || parsed;
    const name = character.name || file.replace('.json', '').replace(/-/g, ' ');

    // Strip portrait to avoid storing megabytes of base64
    const { portrait, ...dataWithoutPortrait } = character;

    await query(
      `INSERT INTO characters (name, data)
       VALUES ($1, $2)`,
      [name, JSON.stringify(dataWithoutPortrait)]
    );

    console.log(`  ${file}: ${name}`);
    count++;
  }

  console.log(`Total: ${count} characters imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
