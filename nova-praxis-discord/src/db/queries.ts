import { query } from './client.js';

export interface GameDataRow {
  id: number;
  category: string;
  name: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  rank: number;
}

export interface GlossaryRow {
  id: number;
  term: string;
  aliases: string[];
  short_def: string | null;
  long_def: string | null;
  tags: string[];
}

export interface RulesSectionRow {
  id: number;
  file_path: string;
  heading: string;
  subsystem: string | null;
  content: string;
  rank: number;
}

export interface EntityCardRow {
  id: number;
  token: string;
  name: string;
  rank: number;
  class: string | null;
  faction: string | null;
  voice_profile: Record<string, unknown> | null;
  full_card: string;
}

export interface CharacterRow {
  id: number;
  discord_user_id: string | null;
  name: string;
  data: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

// --- Game Data ---

export async function searchGameData(searchQuery: string, category?: string) {
  const params: unknown[] = [searchQuery];
  let sql = `
    SELECT id, category, name, description, metadata,
           ts_rank(search_vec, plainto_tsquery('english', $1)) AS rank
    FROM game_data
    WHERE search_vec @@ plainto_tsquery('english', $1)
  `;
  if (category) {
    sql += ` AND category = $2`;
    params.push(category);
  }
  sql += ` ORDER BY rank DESC LIMIT 10`;
  const result = await query<GameDataRow>(sql, params);
  return result.rows;
}

export async function getGameDataByName(name: string, category?: string) {
  const params: unknown[] = [name];
  let sql = `SELECT * FROM game_data WHERE lower(name) = lower($1)`;
  if (category) {
    sql += ` AND category = $2`;
    params.push(category);
  }
  sql += ` LIMIT 1`;
  const result = await query<GameDataRow>(sql, params);
  return result.rows[0] ?? null;
}

// --- Glossary ---

export async function lookupGlossary(term: string) {
  // Try exact match first
  let result = await query<GlossaryRow>(
    `SELECT * FROM glossary WHERE lower(term) = lower($1) LIMIT 1`,
    [term]
  );
  if (result.rows.length > 0) return result.rows[0];

  // Try alias match
  result = await query<GlossaryRow>(
    `SELECT * FROM glossary WHERE lower($1) = ANY(SELECT lower(unnest(aliases))) LIMIT 1`,
    [term]
  );
  if (result.rows.length > 0) return result.rows[0];

  // Fall back to tsvector search
  const searchResult = await query<GlossaryRow>(
    `SELECT *, ts_rank(search_vec, plainto_tsquery('english', $1)) AS rank
     FROM glossary
     WHERE search_vec @@ plainto_tsquery('english', $1)
     ORDER BY rank DESC LIMIT 5`,
    [term]
  );
  return searchResult.rows[0] ?? null;
}

export async function searchGlossary(searchQuery: string) {
  const result = await query<GlossaryRow>(
    `SELECT *, ts_rank(search_vec, plainto_tsquery('english', $1)) AS rank
     FROM glossary
     WHERE search_vec @@ plainto_tsquery('english', $1)
     ORDER BY rank DESC LIMIT 10`,
    [searchQuery]
  );
  return result.rows;
}

// --- Rules ---

export async function searchRules(searchQuery: string, subsystem?: string) {
  const params: unknown[] = [searchQuery];
  let sql = `
    SELECT id, file_path, heading, subsystem, content,
           ts_rank(search_vec, plainto_tsquery('english', $1)) AS rank
    FROM rules_sections
    WHERE search_vec @@ plainto_tsquery('english', $1)
  `;
  if (subsystem) {
    sql += ` AND subsystem = $2`;
    params.push(subsystem);
  }
  sql += ` ORDER BY rank DESC LIMIT 5`;
  const result = await query<RulesSectionRow>(sql, params);
  return result.rows;
}

// --- Entity Cards ---

export async function getEntityCard(token: string) {
  const result = await query<EntityCardRow>(
    `SELECT * FROM entity_cards WHERE lower(token) = lower($1) LIMIT 1`,
    [token]
  );
  return result.rows[0] ?? null;
}

export async function getEntityCardByName(name: string) {
  const result = await query<EntityCardRow>(
    `SELECT * FROM entity_cards WHERE lower(name) LIKE lower($1) LIMIT 1`,
    [`%${name}%`]
  );
  return result.rows[0] ?? null;
}

export async function listEntityCards() {
  const result = await query<EntityCardRow>(
    `SELECT id, token, name, rank, class, faction FROM entity_cards ORDER BY rank DESC, name`
  );
  return result.rows;
}

// --- Characters ---

export async function getCharacter(name: string) {
  const result = await query<CharacterRow>(
    `SELECT * FROM characters WHERE lower(name) LIKE lower($1) LIMIT 1`,
    [`%${name}%`]
  );
  return result.rows[0] ?? null;
}

export async function listCharacters() {
  const result = await query<CharacterRow>(
    `SELECT id, name, discord_user_id, created_at, updated_at FROM characters ORDER BY name`
  );
  return result.rows;
}

export async function upsertCharacter(
  name: string,
  data: Record<string, unknown>,
  discordUserId?: string
) {
  const result = await query<CharacterRow>(
    `INSERT INTO characters (name, data, discord_user_id)
     VALUES ($1, $2, $3)
     ON CONFLICT ((lower(name)))
     DO UPDATE SET data = $2, discord_user_id = COALESCE($3, characters.discord_user_id), updated_at = now()
     RETURNING *`,
    [name, JSON.stringify(data), discordUserId ?? null]
  );
  return result.rows[0];
}

// --- Utility ---

export async function getTableCounts() {
  const tables = ['game_data', 'glossary', 'rules_sections', 'entity_cards', 'characters'];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const result = await query<{ count: string }>(`SELECT count(*) FROM ${table}`);
    counts[table] = parseInt(result.rows[0].count);
  }
  return counts;
}
