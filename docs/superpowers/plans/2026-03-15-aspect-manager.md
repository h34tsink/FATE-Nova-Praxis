# Aspect Manager — Implementation Plan

**Date:** 2026-03-15
**Spec:** `docs/superpowers/specs/2026-03-15-aspect-manager-design.md`
**Depends on:** `src/embeds/gm-response.ts`, `src/embeds/player-response.ts`, `src/db/queries.ts`, `src/autocomplete.ts`, `src/middleware/permissions.ts`

---

## Task 1: Database Migration

**Creates:** `nova-praxis-discord/migrations/002_session_aspects.sql`
**Creates:** `nova-praxis-discord/scripts/migrate.ts`
**Modifies:** `nova-praxis-discord/init.sql` (append new tables)
**Modifies:** `nova-praxis-discord/package.json` (add migrate script)
**Dependencies:** None

### `migrations/002_session_aspects.sql`

```sql
-- Aspect Manager: session_aspects + aspect_usage tables
-- Run: npm run migrate

-- Aspect types enum
CREATE TYPE aspect_type AS ENUM (
    'scene', 'hidden', 'dynamic', 'consequence',
    'persistent', 'zone', 'maneuver', 'character', 'equipment'
);

-- Consequence severity enum
CREATE TYPE aspect_severity AS ENUM ('mild', 'moderate', 'severe', 'extreme');

-- Active aspects tracked per session
CREATE TABLE session_aspects (
    id              SERIAL PRIMARY KEY,
    session_num     INT NOT NULL,
    text            TEXT NOT NULL,
    type            aspect_type NOT NULL DEFAULT 'scene',
    source          TEXT,
    severity        aspect_severity,
    free_invokes    INT NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    removed_at      TIMESTAMPTZ
);

CREATE INDEX idx_session_aspects_session ON session_aspects (session_num);
CREATE INDEX idx_session_aspects_active ON session_aspects (session_num, active);

-- Track invocations and compels
CREATE TABLE aspect_usage (
    id              SERIAL PRIMARY KEY,
    aspect_id       INT NOT NULL REFERENCES session_aspects(id) ON DELETE CASCADE,
    usage_type      TEXT NOT NULL CHECK (usage_type IN ('invoke', 'compel')),
    player_name     TEXT NOT NULL,
    discord_user_id TEXT,
    free            BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aspect_usage_aspect ON aspect_usage (aspect_id);
```

### `scripts/migrate.ts`

```typescript
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
```

### Append to `init.sql`

Add at the bottom of the existing file:

```sql
-- Aspect types enum
CREATE TYPE aspect_type AS ENUM (
    'scene', 'hidden', 'dynamic', 'consequence',
    'persistent', 'zone', 'maneuver', 'character', 'equipment'
);

-- Consequence severity enum
CREATE TYPE aspect_severity AS ENUM ('mild', 'moderate', 'severe', 'extreme');

-- Active aspects tracked per session
CREATE TABLE session_aspects (
    id              SERIAL PRIMARY KEY,
    session_num     INT NOT NULL,
    text            TEXT NOT NULL,
    type            aspect_type NOT NULL DEFAULT 'scene',
    source          TEXT,
    severity        aspect_severity,
    free_invokes    INT NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    removed_at      TIMESTAMPTZ
);

CREATE INDEX idx_session_aspects_session ON session_aspects (session_num);
CREATE INDEX idx_session_aspects_active ON session_aspects (session_num, active);

-- Track invocations and compels
CREATE TABLE aspect_usage (
    id              SERIAL PRIMARY KEY,
    aspect_id       INT NOT NULL REFERENCES session_aspects(id) ON DELETE CASCADE,
    usage_type      TEXT NOT NULL CHECK (usage_type IN ('invoke', 'compel')),
    player_name     TEXT NOT NULL,
    discord_user_id TEXT,
    free            BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aspect_usage_aspect ON aspect_usage (aspect_id);
```

### `package.json` change

Add to `scripts`:

```json
"migrate": "tsx scripts/migrate.ts"
```

### Commit message

```
feat: Add session_aspects and aspect_usage schema migration
```

---

## Task 2: Aspect Query Module

**Creates:** `nova-praxis-discord/src/db/aspect-queries.ts`
**Modifies:** `nova-praxis-discord/src/db/queries.ts` (add `getActiveAspects` export, update `getTableCounts`)
**Dependencies:** Task 1

### `src/db/aspect-queries.ts`

```typescript
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
```

### Changes to `src/db/queries.ts`

Add to imports section and re-export `getActiveAspects`:

```typescript
// At bottom of file, add:

// --- Aspects (re-export for cross-feature use) ---

export { getActiveAspects } from './aspect-queries.js';
export type { AspectWithUsage } from './aspect-queries.js';
```

Update `getTableCounts`:

```typescript
export async function getTableCounts() {
  const tables = ['game_data', 'glossary', 'rules_sections', 'entity_cards', 'characters', 'sessions', 'session_aspects', 'aspect_usage'];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const result = await query<{ count: string }>(`SELECT count(*) FROM ${table}`);
    counts[table] = parseInt(result.rows[0].count);
  }
  return counts;
}
```

### Commit message

```
feat: Add aspect query module with CRUD, invoke, compel, and autocomplete
```

---

## Task 3: Aspect Embed Builders

**Creates:** `nova-praxis-discord/src/embeds/aspect-embeds.ts`
**Dependencies:** Task 2 (uses `AspectWithUsage` type)

### `src/embeds/aspect-embeds.ts`

```typescript
import { EmbedBuilder } from 'discord.js';
import { AspectWithUsage } from '../db/aspect-queries.js';

const COLOR_VISIBLE = 0x5865f2;    // blurple
const COLOR_HIDDEN = 0xed4245;     // red
const COLOR_INVOKE = 0x57f287;     // green
const COLOR_COMPEL = 0xe67e22;     // orange
const COLOR_CLEAR = 0x95a5a6;      // grey

function usageMarkers(aspect: AspectWithUsage): string {
  const marks: string[] = [];
  if (aspect.invocations > 0) marks.push('I'.repeat(aspect.invocations));
  if (aspect.compels > 0) marks.push('C'.repeat(aspect.compels));
  if (aspect.free_used > 0) marks.push('F'.repeat(aspect.free_used));
  return marks.join('');
}

function formatAspectTable(aspects: AspectWithUsage[]): string {
  if (aspects.length === 0) return 'No active aspects this session.';

  // Calculate column widths
  const rows = aspects.map((a) => ({
    text: a.severity ? `${a.text} (${a.severity})` : a.text,
    type: a.type,
    source: a.source || '',
    used: usageMarkers(a),
  }));

  const colWidths = {
    text: Math.max(6, ...rows.map((r) => r.text.length)),
    type: Math.max(4, ...rows.map((r) => r.type.length)),
    source: Math.max(6, ...rows.map((r) => r.source.length)),
    used: Math.max(4, ...rows.map((r) => r.used.length)),
  };

  // Cap widths to prevent overflow
  colWidths.text = Math.min(colWidths.text, 32);
  colWidths.source = Math.min(colWidths.source, 14);

  const header = [
    'Aspect'.padEnd(colWidths.text),
    'Type'.padEnd(colWidths.type),
    'Source'.padEnd(colWidths.source),
    'Used'.padEnd(colWidths.used),
  ].join(' | ');

  const separator = [
    '-'.repeat(colWidths.text),
    '-'.repeat(colWidths.type),
    '-'.repeat(colWidths.source),
    '-'.repeat(colWidths.used),
  ].join('-+-');

  const lines = rows.map((r) =>
    [
      r.text.slice(0, colWidths.text).padEnd(colWidths.text),
      r.type.padEnd(colWidths.type),
      r.source.slice(0, colWidths.source).padEnd(colWidths.source),
      r.used.padEnd(colWidths.used),
    ].join(' | ')
  );

  return '```\n' + [header, separator, ...lines].join('\n') + '\n```';
}

export function aspectListEmbed(aspects: AspectWithUsage[], sessionNum: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`Active Aspects — Session ${sessionNum}`)
    .setDescription(formatAspectTable(aspects))
    .setColor(COLOR_VISIBLE)
    .setFooter({ text: 'I = Invoked | C = Compelled | F = Free Invoke Used' });
}

export function hiddenAspectListEmbed(aspects: AspectWithUsage[], sessionNum: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`Hidden Aspects — Session ${sessionNum}`)
    .setDescription(formatAspectTable(aspects))
    .setColor(COLOR_HIDDEN)
    .setFooter({ text: 'GM Only | I = Invoked | C = Compelled | F = Free Invoke Used' });
}

export function aspectAddedEmbed(text: string, type: string, source?: string, hidden?: boolean): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Aspect Added')
    .setColor(hidden ? COLOR_HIDDEN : COLOR_VISIBLE);

  let desc = `**"${text}"**\nType: ${type}`;
  if (source) desc += ` | Source: ${source}`;
  embed.setDescription(desc);

  if (hidden) embed.setFooter({ text: 'GM Only — hidden from players' });
  return embed;
}

export function aspectInvokedEmbed(
  aspectText: string,
  playerName: string,
  free: boolean
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Aspect Invoked')
    .setDescription(
      `**"${aspectText}"** invoked by **${playerName}**\nFP: ${free ? 'FREE INVOKE' : '-1 (paid)'}`
    )
    .setColor(COLOR_INVOKE);
}

export function aspectCompelledEmbed(aspectText: string, playerName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Aspect Compelled')
    .setDescription(`**"${aspectText}"** compelled on **${playerName}**\nFP: +1 earned`)
    .setColor(COLOR_COMPEL);
}

export function aspectClearedEmbed(removed: number, remaining: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Scene Aspects Cleared')
    .setDescription(
      `Scene aspects cleared. **${removed}** aspects removed. **${remaining}** persistent aspects remain.`
    )
    .setColor(COLOR_CLEAR);
}

export function aspectRemovedText(text: string): string {
  return `Removed: *${text}*`;
}
```

### Commit message

```
feat: Add aspect embed builders for list, invoke, compel, add, clear
```

---

## Task 4: Command Rewrite — `/aspects` Subcommand Group

**Modifies:** `nova-praxis-discord/src/commands/aspects.ts` (full rewrite)
**Dependencies:** Task 2, Task 3

### `src/commands/aspects.ts`

```typescript
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { isGM, requireGM } from '../middleware/permissions.js';
import { callClaude } from '../claude/cli.js';
import { buildAspectsContext } from '../claude/context.js';
import { gmResponseEmbed } from '../embeds/gm-response.js';
import { getLatestSessionNum, getCharacter } from '../db/queries.js';
import {
  createAspect,
  getActiveAspects,
  getVisibleAspects,
  getHiddenAspects,
  getAspectById,
  invokeAspect,
  compelAspect,
  removeAspect,
  clearSessionAspects,
} from '../db/aspect-queries.js';
import {
  aspectListEmbed,
  hiddenAspectListEmbed,
  aspectAddedEmbed,
  aspectInvokedEmbed,
  aspectCompelledEmbed,
  aspectClearedEmbed,
  aspectRemovedText,
} from '../embeds/aspect-embeds.js';
import { cacheAspectSuggestions } from '../aspect-cache.js';

const ASPECT_TYPES = [
  { name: 'Scene', value: 'scene' },
  { name: 'Hidden (GM-only)', value: 'hidden' },
  { name: 'Dynamic', value: 'dynamic' },
  { name: 'Consequence', value: 'consequence' },
  { name: 'Persistent', value: 'persistent' },
  { name: 'Zone', value: 'zone' },
  { name: 'Maneuver', value: 'maneuver' },
  { name: 'Character', value: 'character' },
  { name: 'Equipment', value: 'equipment' },
];

const SEVERITY_CHOICES = [
  { name: 'Mild', value: 'mild' },
  { name: 'Moderate', value: 'moderate' },
  { name: 'Severe', value: 'severe' },
  { name: 'Extreme', value: 'extreme' },
];

export const data = new SlashCommandBuilder()
  .setName('aspects')
  .setDescription('Manage FATE Aspects during play')

  .addSubcommand((sub) =>
    sub
      .setName('generate')
      .setDescription('[GM] Generate suggested aspects via Claude')
      .addStringOption((opt) =>
        opt.setName('subject').setDescription('What to generate aspects for').setRequired(true)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('suggest').setDescription('[GM] Pull aspects from active scene/entity data')
  )

  .addSubcommand((sub) =>
    sub
      .setName('add')
      .setDescription('[GM] Add an aspect to the active scene')
      .addStringOption((opt) =>
        opt.setName('text').setDescription('The aspect text').setRequired(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('type')
          .setDescription('Aspect type')
          .setRequired(true)
          .addChoices(...ASPECT_TYPES)
      )
      .addStringOption((opt) =>
        opt.setName('source').setDescription('Who/what this is attached to')
      )
      .addStringOption((opt) =>
        opt
          .setName('severity')
          .setDescription('Consequence severity (required for consequence type)')
          .addChoices(...SEVERITY_CHOICES)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('list').setDescription('Show active aspects')
  )

  .addSubcommand((sub) =>
    sub
      .setName('invoke')
      .setDescription('Invoke an aspect')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to invoke')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('player')
          .setDescription('Character invoking')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub
      .setName('compel')
      .setDescription('[GM] Compel an aspect on a player')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to compel')
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((opt) =>
        opt
          .setName('player')
          .setDescription('Character being compelled')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub
      .setName('remove')
      .setDescription('[GM] Remove an aspect')
      .addStringOption((opt) =>
        opt
          .setName('aspect')
          .setDescription('Aspect to remove')
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

  .addSubcommand((sub) =>
    sub.setName('clear').setDescription('[GM] Clear scene aspects (scene transition)')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();

  switch (sub) {
    case 'generate':
      return handleGenerate(interaction);
    case 'suggest':
      return handleSuggest(interaction);
    case 'add':
      return handleAdd(interaction);
    case 'list':
      return handleList(interaction);
    case 'invoke':
      return handleInvoke(interaction);
    case 'compel':
      return handleCompel(interaction);
    case 'remove':
      return handleRemove(interaction);
    case 'clear':
      return handleClear(interaction);
  }
}

async function handleGenerate(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply({ ephemeral: true });

  const subject = interaction.options.getString('subject', true);

  try {
    const prompt = await buildAspectsContext(subject);
    const result = await callClaude(prompt);
    const embeds = gmResponseEmbed('Aspects', result.output);

    // Parse aspect lines and create "Add to Scene" buttons
    const aspects = parseAspectLines(result.output);
    const components = buildAddButtons(aspects, interaction.id);

    await interaction.editReply({ embeds, components });
  } catch (err) {
    await interaction.editReply({
      content: `Claude CLI error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}

async function handleSuggest(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  await interaction.deferReply({ ephemeral: true });

  try {
    const { getSessionSections, getLatestSessionNum: getNum } = await import('../db/queries.js');
    const sessionNum = await getNum();
    if (!sessionNum) {
      await interaction.editReply({ content: 'No active session data found. Use `/aspects generate` instead.' });
      return;
    }

    const sceneSections = await getSessionSections(sessionNum, 'scenes');
    if (sceneSections.length === 0) {
      await interaction.editReply({ content: 'No active scene data found. Use `/aspects generate` instead.' });
      return;
    }

    // Get the most recent scene
    const latestScene = sceneSections[sceneSections.length - 1];
    const extracted = extractAspectsFromContent(latestScene.content);

    if (extracted.length === 0) {
      await interaction.editReply({ content: 'No aspects found in scene data. Use `/aspects generate` instead.' });
      return;
    }

    const desc = extracted.map((a) => `- **${a}**`).join('\n');
    const embed = new (await import('discord.js')).EmbedBuilder()
      .setTitle('Suggested Aspects')
      .setDescription(desc)
      .setColor(0xed4245)
      .setFooter({ text: 'GM Only | Click to add to scene' });

    const components = buildAddButtons(extracted, interaction.id);

    await interaction.editReply({ embeds: [embed], components });
  } catch (err) {
    await interaction.editReply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
    });
  }
}

async function handleAdd(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const text = interaction.options.getString('text', true);
  const type = interaction.options.getString('type', true);
  const source = interaction.options.getString('source') ?? undefined;
  const severity = interaction.options.getString('severity') ?? undefined;

  if (type === 'consequence' && !severity) {
    await interaction.reply({
      content: 'Consequence aspects require a severity (mild/moderate/severe/extreme).',
      ephemeral: true,
    });
    return;
  }

  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  await createAspect(sessionNum, text, type, source, severity);

  const hidden = type === 'hidden';
  const embed = aspectAddedEmbed(text, type, source, hidden);
  await interaction.reply({ embeds: [embed], ephemeral: hidden });
}

async function handleList(interaction: ChatInputCommandInteraction) {
  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  const gm = isGM(interaction);

  const visible = await getVisibleAspects(sessionNum);
  const visibleEmbed = aspectListEmbed(visible, sessionNum);

  if (visible.length === 0 && !gm) {
    await interaction.reply({ content: 'No active aspects this session.', ephemeral: true });
    return;
  }

  await interaction.reply({ embeds: [visibleEmbed] });

  if (gm) {
    const hidden = await getHiddenAspects(sessionNum);
    if (hidden.length > 0) {
      const hiddenEmbed = hiddenAspectListEmbed(hidden, sessionNum);
      await interaction.followUp({ embeds: [hiddenEmbed], ephemeral: true });
    }
  }
}

async function handleInvoke(interaction: ChatInputCommandInteraction) {
  const aspectId = parseInt(interaction.options.getString('aspect', true));
  const playerName = interaction.options.getString('player', true);

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  // Permission check: GM can invoke for anyone, players only for their own character
  const gm = isGM(interaction);
  if (!gm) {
    const character = await getCharacter(playerName);
    if (!character || character.discord_user_id !== interaction.user.id) {
      await interaction.reply({
        content: 'You can only invoke aspects on your own character.',
        ephemeral: true,
      });
      return;
    }
  }

  try {
    const aspect = await getAspectById(aspectId);
    if (!aspect || !aspect.active) {
      await interaction.reply({ content: 'Aspect not active.', ephemeral: true });
      return;
    }

    const { free } = await invokeAspect(aspectId, playerName, interaction.user.id);
    const embed = aspectInvokedEmbed(aspect.text, playerName, free);
    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    await interaction.reply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
      ephemeral: true,
    });
  }
}

async function handleCompel(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const aspectId = parseInt(interaction.options.getString('aspect', true));
  const playerName = interaction.options.getString('player', true);

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  try {
    const aspect = await getAspectById(aspectId);
    if (!aspect || !aspect.active) {
      await interaction.reply({ content: 'Aspect not active.', ephemeral: true });
      return;
    }

    await compelAspect(aspectId, playerName, interaction.user.id);
    const embed = aspectCompelledEmbed(aspect.text, playerName);
    await interaction.reply({ embeds: [embed] });
  } catch (err) {
    await interaction.reply({
      content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
      ephemeral: true,
    });
  }
}

async function handleRemove(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const aspectId = parseInt(interaction.options.getString('aspect', true));

  if (isNaN(aspectId)) {
    await interaction.reply({ content: 'Invalid aspect selection.', ephemeral: true });
    return;
  }

  const removed = await removeAspect(aspectId);
  if (!removed) {
    await interaction.reply({ content: 'Aspect not found or already removed.', ephemeral: true });
    return;
  }

  await interaction.reply({ content: aspectRemovedText(removed.text), ephemeral: true });
}

async function handleClear(interaction: ChatInputCommandInteraction) {
  if (!(await requireGM(interaction))) return;

  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) {
    await interaction.reply({ content: 'No active session found.', ephemeral: true });
    return;
  }

  // Check if there are any clearable aspects
  const active = await getActiveAspects(sessionNum);
  const clearable = active.filter(
    (a) =>
      ['scene', 'hidden', 'dynamic', 'zone', 'maneuver'].includes(a.type) ||
      (a.type === 'consequence' && a.severity === 'mild')
  );

  if (clearable.length === 0) {
    await interaction.reply({ content: 'No aspects to clear.', ephemeral: true });
    return;
  }

  // Send confirmation button
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`aspect_clear_confirm_${sessionNum}`)
      .setLabel(`Clear ${clearable.length} aspect${clearable.length === 1 ? '' : 's'}`)
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('aspect_clear_cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
  );

  await interaction.reply({
    content: `This will remove **${clearable.length}** scene/transient aspects. Persistent, character, equipment, and moderate+ consequence aspects will survive.`,
    components: [row],
    ephemeral: true,
  });
}

// --- Helpers ---

export function parseAspectLines(text: string): string[] {
  const aspects: string[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // Match "- **Aspect Text**" or "- *Aspect Text*" or "- Aspect Text"
    const boldMatch = line.match(/^[-*]\s+\*{1,2}([^*]+)\*{1,2}/);
    if (boldMatch) {
      aspects.push(boldMatch[1].trim());
      continue;
    }
    // Match "Aspect:" labeled lines
    const labelMatch = line.match(/Aspect:\s*(.+)/i);
    if (labelMatch) {
      aspects.push(labelMatch[1].trim());
    }
  }

  return aspects.slice(0, 10); // cap at 10
}

function extractAspectsFromContent(content: string): string[] {
  return parseAspectLines(content);
}

function buildAddButtons(
  aspects: string[],
  interactionId: string
): ActionRowBuilder<ButtonBuilder>[] {
  const toShow = aspects.slice(0, 5);
  if (toShow.length === 0) return [];

  // Cache the aspect texts for button handler
  cacheAspectSuggestions(interactionId, toShow);

  const row = new ActionRowBuilder<ButtonBuilder>();
  for (let i = 0; i < toShow.length; i++) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`aspect_add_${interactionId}_${i}`)
        .setLabel(toShow[i].slice(0, 80))
        .setStyle(ButtonStyle.Primary)
    );
  }

  return [row];
}
```

### Commit message

```
feat: Rewrite /aspects as subcommand group with full CRUD, invoke, and compel
```

---

## Task 5: Aspect Suggestion Cache

**Creates:** `nova-praxis-discord/src/aspect-cache.ts`
**Dependencies:** None (but used by Task 4 and Task 6)

### `src/aspect-cache.ts`

```typescript
interface CachedSuggestions {
  aspects: string[];
  timestamp: number;
}

const cache = new Map<string, CachedSuggestions>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

export function cacheAspectSuggestions(interactionId: string, aspects: string[]): void {
  cache.set(interactionId, { aspects, timestamp: Date.now() });
}

export function getCachedAspect(interactionId: string, index: number): string | null {
  const entry = cache.get(interactionId);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(interactionId);
    return null;
  }
  return entry.aspects[index] ?? null;
}

// Sweep expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.timestamp > TTL_MS) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();
```

### Commit message

```
feat: Add in-memory cache for aspect suggestion buttons
```

---

## Task 6: Autocomplete Updates

**Modifies:** `nova-praxis-discord/src/autocomplete.ts`
**Dependencies:** Task 2

Replace the entire file with:

### `src/autocomplete.ts`

```typescript
import { AutocompleteInteraction } from 'discord.js';
import { query } from './db/client.js';
import { autocompleteAspects } from './db/aspect-queries.js';
import { getLatestSessionNum } from './db/queries.js';
import { isGM as checkGM } from './middleware/permissions.js';
import { GuildMember } from 'discord.js';

export async function handleAutocomplete(interaction: AutocompleteInteraction) {
  const focused = interaction.options.getFocused(true);
  const value = focused.value.toLowerCase();

  try {
    let choices: { name: string; value: string }[] = [];

    switch (interaction.commandName) {
      case 'glossary': {
        if (!value) break;
        const result = await query<{ term: string }>(
          `SELECT term FROM glossary WHERE lower(term) LIKE $1 ORDER BY term LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.term, value: r.term }));
        break;
      }

      case 'character': {
        if (!value) break;
        const result = await query<{ name: string }>(
          `SELECT name FROM characters WHERE lower(name) LIKE $1 ORDER BY name LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({ name: r.name, value: r.name }));
        break;
      }

      case 'npc': {
        if (!value || focused.name !== 'token') break;
        const result = await query<{ token: string; name: string; rank: number }>(
          `SELECT token, name, rank FROM entity_cards
           WHERE lower(token) LIKE $1 OR lower(name) LIKE $1
           ORDER BY rank DESC, name LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({
          name: `${r.name} (R${r.rank}) — ${r.token}`,
          value: r.token,
        }));
        break;
      }

      case 'lookup': {
        if (!value || focused.name !== 'query') break;
        const result = await query<{ name: string; category: string }>(
          `SELECT DISTINCT name, category FROM game_data
           WHERE lower(name) LIKE $1
           ORDER BY name LIMIT 10`,
          [`%${value}%`]
        );
        choices = result.rows.map((r) => ({
          name: `${r.name} [${r.category}]`,
          value: r.name,
        }));
        break;
      }

      case 'aspects': {
        if (focused.name === 'aspect') {
          const sessionNum = await getLatestSessionNum();
          if (!sessionNum) break;

          const sub = interaction.options.getSubcommand();
          // For invoke: hide hidden aspects from non-GMs
          // For compel/remove: GM-only commands, show all
          const member = interaction.member;
          const gm = member instanceof GuildMember &&
            member.roles.cache.some((r) => r.name.toLowerCase() === 'gm');
          const includeHidden = gm || sub !== 'invoke';

          const rows = await autocompleteAspects(sessionNum, value, includeHidden);
          choices = rows.map((r) => ({
            name: `${r.text} [${r.type}]`.slice(0, 100),
            value: String(r.id),
          }));
        }

        if (focused.name === 'player') {
          const result = await query<{ name: string }>(
            `SELECT name FROM characters WHERE lower(name) LIKE $1 ORDER BY name LIMIT 10`,
            [value ? `%${value}%` : '%']
          );
          choices = result.rows.map((r) => ({ name: r.name, value: r.name }));
        }
        break;
      }
    }

    await interaction.respond(choices.slice(0, 25));
  } catch {
    await interaction.respond([]);
  }
}
```

### Commit message

```
feat: Add aspect and player autocomplete for /aspects subcommands
```

---

## Task 7: Button Interaction Handler + Integration

**Modifies:** `nova-praxis-discord/src/index.ts` (add button handler)
**Modifies:** `nova-praxis-discord/src/claude/context.ts` (add aspects to recap context)
**Dependencies:** Task 2, Task 4, Task 5

### Changes to `src/index.ts`

Add import at top:

```typescript
import { getCachedAspect } from './aspect-cache.js';
import { createAspect } from './db/aspect-queries.js';
import { getLatestSessionNum } from './db/queries.js';
```

Replace the interaction handler block (the `client.on(Events.InteractionCreate, ...)`) with:

```typescript
// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  if (interaction.isButton()) {
    await handleButton(interaction);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    try {
      const content = 'Something went wrong executing that command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    } catch { /* interaction expired */ }
  }
});

async function handleButton(interaction: import('discord.js').ButtonInteraction) {
  const id = interaction.customId;

  // "Add to Scene" buttons from /aspects generate or /aspects suggest
  const addMatch = id.match(/^aspect_add_(\d+)_(\d+)$/);
  if (addMatch) {
    const interactionId = addMatch[1];
    const index = parseInt(addMatch[2]);
    const aspectText = getCachedAspect(interactionId, index);

    if (!aspectText) {
      await interaction.reply({ content: 'Suggestion expired. Run the command again.', ephemeral: true });
      return;
    }

    const sessionNum = await getLatestSessionNum();
    if (!sessionNum) {
      await interaction.reply({ content: 'No active session found.', ephemeral: true });
      return;
    }

    await createAspect(sessionNum, aspectText, 'scene');
    await interaction.reply({ content: `Added to scene: **"${aspectText}"**`, ephemeral: true });
    return;
  }

  // Clear confirmation button
  const clearMatch = id.match(/^aspect_clear_confirm_(\d+)$/);
  if (clearMatch) {
    const sessionNum = parseInt(clearMatch[1]);
    const { clearSessionAspects } = await import('./db/aspect-queries.js');
    const { aspectClearedEmbed } = await import('./embeds/aspect-embeds.js');

    const { removed, remaining } = await clearSessionAspects(sessionNum);
    const embed = aspectClearedEmbed(removed, remaining);

    // Update the ephemeral confirmation message
    await interaction.update({ content: null, embeds: [], components: [] });
    // Post public announcement
    await interaction.followUp({ embeds: [embed] });
    return;
  }

  if (id === 'aspect_clear_cancel') {
    await interaction.update({ content: 'Clear cancelled.', components: [], embeds: [] });
    return;
  }
}
```

### Changes to `src/claude/context.ts`

Add import at top:

```typescript
import { getActiveAspects } from '../db/aspect-queries.js';
```

Replace the `buildRecapContext` function with:

```typescript
export async function buildRecapContext(): Promise<string> {
  const sessionNum = await getLatestSessionNum();
  if (!sessionNum) return `Generate a session recap using the /recap command format from the nova-praxis-gm plugin.`;

  const sections: string[] = [];

  // Get state files first (GM Command Board, Live Dashboard)
  const stateSections = await getSessionSections(sessionNum, 'state');
  if (stateSections.length > 0) {
    sections.push(`## Session ${sessionNum} — Live State\n\n${stateSections.map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get guide/index
  const guideSections = await getSessionSections(sessionNum, 'guide');
  if (guideSections.length > 0) {
    sections.push(`## Session Guide\n\n${guideSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get scenes
  const sceneSections = await getSessionSections(sessionNum, 'scenes');
  if (sceneSections.length > 0) {
    sections.push(`## Scenes\n\n${sceneSections.slice(0, 5).map((s) => `### ${s.heading}\n${s.content}`).join('\n\n')}`);
  }

  // Get active aspects
  const aspects = await getActiveAspects(sessionNum);
  if (aspects.length > 0) {
    const aspectLines = aspects.map((a) => {
      let line = `- [${a.type}] ${a.text}`;
      if (a.severity) line += ` — ${a.severity}`;
      if (a.source) line += ` (${a.source})`;
      return line;
    });
    sections.push(`## Active Aspects\n\n${aspectLines.join('\n')}`);
  }

  const context = sections.join('\n\n---\n\n');
  return `Using the following session ${sessionNum} data from the database, generate a recap using the /recap command format from the nova-praxis-gm plugin.\n\n${context}`;
}
```

### Commit message

```
feat: Add button handlers for aspect add/clear and integrate aspects into recap
```

---

## Execution Order

| Order | Task | What | Blocked by |
|-------|------|------|-----------|
| 1 | Task 1 | Database migration + script | — |
| 2 | Task 5 | Aspect cache | — |
| 3 | Task 2 | Query module | Task 1 (schema must exist) |
| 4 | Task 3 | Embed builders | Task 2 (types) |
| 5 | Task 6 | Autocomplete | Task 2 (query functions) |
| 6 | Task 4 | Command rewrite | Tasks 2, 3, 5 |
| 7 | Task 7 | Button handler + integration | Tasks 2, 4, 5 |

Tasks 1 and 5 can run in parallel. Tasks 3, 5, and 6 can also run in parallel once Task 2 is done.

## Deferred (Not in Scope)

These are mentioned in the spec but deferred to separate tasks:

- **`/scene` auto-population:** Adding "Add to Scene" buttons to `/scene` output. Requires `parseAspectLines` (exported from Task 4) and the button cache (Task 5). Small change to `src/commands/scene.ts` — add after the existing embed reply.
- **Share with Players integration:** If the Share with Players feature lands first, the button handler in Task 7 may need to coexist with its button handler. Both use `customId` prefix routing so there's no conflict.
