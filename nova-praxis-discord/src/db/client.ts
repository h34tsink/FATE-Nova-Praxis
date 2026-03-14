import pg from 'pg';
import { config } from '../config.js';

const pool = new pg.Pool(config.db);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function getClient() {
  return pool.connect();
}

export async function closePool() {
  await pool.end();
}

export { pool };
