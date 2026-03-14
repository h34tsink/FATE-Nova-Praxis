import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'nova',
  password: process.env.PGPASSWORD || 'changeme',
  database: process.env.PGDATABASE || 'nova_praxis',
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}

export async function end() {
  await pool.end();
}

export { pool };
