import { readFileSync } from 'fs';
import { join } from 'path';
import { pool, query, end } from './db-connect.js';

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('Usage: tsx scripts/migrate.ts <migration-file>');
  process.exit(1);
}

const sql = readFileSync(join('migrations', migrationFile), 'utf-8');

async function main() {
  try {
    await query(sql);
    console.log(`Migration applied: ${migrationFile}`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await end();
  }
}

main();
