import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { pool } from '../src/db/client.js';

async function resetDb() {
  const dbName = process.env.PGDATABASE || 'nova_praxis';
  console.log(`Resetting database: ${dbName}`);

  // Drop all tables, types, functions in the public schema
  await pool.query(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
      FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
      END LOOP;
      FOR r IN (SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace AND prokind = 'f') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || ' CASCADE';
      END LOOP;
    END $$;
  `);
  console.log('Dropped all tables, types, and functions');

  // Re-create from init.sql
  const initSql = readFileSync(new URL('../init.sql', import.meta.url), 'utf-8');
  await pool.query(initSql);
  console.log('Schema recreated from init.sql');

  await pool.end();
  console.log('Done. Run `npm run import` to reload data.');
}

resetDb().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
