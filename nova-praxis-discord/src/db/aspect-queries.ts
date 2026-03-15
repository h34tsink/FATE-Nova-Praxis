import { query } from './client.js';

export interface SessionAspectRow {
  id: number;
  session_num: number;
  text: string;
  type: string;
  source: string | null;
  severity: string | null;
  free_invokes: number;
  active: boolean;
  created_at: Date;
  removed_at: Date | null;
}

export interface AspectUsageRow {
  id: number;
  aspect_id: number;
  usage_type: 'invoke' | 'compel';
  player_name: string;
  discord_user_id: string | null;
  free: boolean;
  created_at: Date;
}

export interface AspectWithUsage extends SessionAspectRow {
  invocations: number;
  compels: number;
  free_used: number;
}

export async function createAspect(
  sessionNum: number,
  text: string,
  type: string,
  source?: string,
  severity?: string
): Promise<SessionAspectRow> {
  const freeInvokes = type === 'maneuver' ? 1 : 0;
  const result = await query<SessionAspectRow>(
    `INSERT INTO session_aspects (session_num, text, type, source, severity, free_invokes)
     VALUES ($1, $2, $3::aspect_type, $4, $5::aspect_severity, $6)
     RETURNING *`,
    [sessionNum, text, type, source ?? null, severity ?? null, freeInvokes]
  );
  return result.rows[0];
}

export async function getActiveAspects(sessionNum: number): Promise<AspectWithUsage[]> {
  const result = await query<AspectWithUsage>(
    `SELECT sa.*,
            coalesce(sum(CASE WHEN au.usage_type = 'invoke' AND NOT au.free THEN 1 ELSE 0 END), 0)::int AS invocations,
            coalesce(sum(CASE WHEN au.usage_type = 'compel' THEN 1 ELSE 0 END), 0)::int AS compels,
            coalesce(sum(CASE WHEN au.free THEN 1 ELSE 0 END), 0)::int AS free_used
     FROM session_aspects sa
     LEFT JOIN aspect_usage au ON au.aspect_id = sa.id
     WHERE sa.session_num = $1 AND sa.active = true
     GROUP BY sa.id
     ORDER BY sa.type, sa.created_at`,
    [sessionNum]
  );
  return result.rows;
}

export async function getVisibleAspects(sessionNum: number): Promise<AspectWithUsage[]> {
  const all = await getActiveAspects(sessionNum);
  return all.filter((a) => a.type !== 'hidden');
}

export async function getHiddenAspects(sessionNum: number): Promise<AspectWithUsage[]> {
  const all = await getActiveAspects(sessionNum);
  return all.filter((a) => a.type === 'hidden');
}

export async function getAspectById(id: number): Promise<SessionAspectRow | null> {
  const result = await query<SessionAspectRow>(
    `SELECT * FROM session_aspects WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function invokeAspect(
  aspectId: number,
  playerName: string,
  discordUserId: string
): Promise<{ free: boolean }> {
  // Check free invokes
  const aspect = await getAspectById(aspectId);
  if (!aspect || !aspect.active) throw new Error('Aspect not active');

  const isFree = aspect.free_invokes > 0;

  if (isFree) {
    await query(
      `UPDATE session_aspects SET free_invokes = free_invokes - 1 WHERE id = $1`,
      [aspectId]
    );
  }

  await query(
    `INSERT INTO aspect_usage (aspect_id, usage_type, player_name, discord_user_id, free)
     VALUES ($1, 'invoke', $2, $3, $4)`,
    [aspectId, playerName, discordUserId, isFree]
  );

  return { free: isFree };
}

export async function compelAspect(
  aspectId: number,
  playerName: string,
  discordUserId: string
): Promise<void> {
  const aspect = await getAspectById(aspectId);
  if (!aspect || !aspect.active) throw new Error('Aspect not active');

  await query(
    `INSERT INTO aspect_usage (aspect_id, usage_type, player_name, discord_user_id)
     VALUES ($1, 'compel', $2, $3)`,
    [aspectId, playerName, discordUserId]
  );
}

export async function removeAspect(aspectId: number): Promise<SessionAspectRow | null> {
  const result = await query<SessionAspectRow>(
    `UPDATE session_aspects SET active = false, removed_at = now()
     WHERE id = $1 AND active = true
     RETURNING *`,
    [aspectId]
  );
  return result.rows[0] ?? null;
}

export async function clearSessionAspects(sessionNum: number): Promise<{ removed: number; remaining: number }> {
  // Clear scene-transient types + mild consequences
  const clearResult = await query<{ count: string }>(
    `WITH cleared AS (
       UPDATE session_aspects SET active = false, removed_at = now()
       WHERE session_num = $1 AND active = true
         AND (
           type IN ('scene', 'hidden', 'dynamic', 'zone', 'maneuver')
           OR (type = 'consequence' AND severity = 'mild')
         )
       RETURNING id
     )
     SELECT count(*)::text AS count FROM cleared`,
    [sessionNum]
  );

  const remainResult = await query<{ count: string }>(
    `SELECT count(*)::text AS count FROM session_aspects WHERE session_num = $1 AND active = true`,
    [sessionNum]
  );

  return {
    removed: parseInt(clearResult.rows[0].count),
    remaining: parseInt(remainResult.rows[0].count),
  };
}

export async function autocompleteAspects(
  sessionNum: number,
  search: string,
  includeHidden: boolean
): Promise<{ id: number; text: string; type: string }[]> {
  const params: unknown[] = [sessionNum];
  let sql = `SELECT id, text, type FROM session_aspects
             WHERE session_num = $1 AND active = true`;

  if (!includeHidden) {
    sql += ` AND type != 'hidden'`;
  }

  if (search) {
    sql += ` AND lower(text) LIKE lower($${params.length + 1} || '%')`;
    params.push(search);
  }

  sql += ` ORDER BY created_at DESC LIMIT 25`;

  const result = await query<{ id: number; text: string; type: string }>(sql, params);
  return result.rows;
}
