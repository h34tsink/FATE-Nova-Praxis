# Aspect Manager — Design Spec

**Date:** 2026-03-15
**Status:** Draft
**Scope:** Replace display-only `/aspects` command with a full subcommand group that tracks active FATE Aspects during play

## Context

The current `/aspects` command (`src/commands/aspects.ts`) is a one-shot Claude call: the GM types a subject, Claude generates suggested aspects, and the result is displayed as an embed. There is no state. Aspects exist only in the GM's head and on paper.

During play, the GM needs to:
- Track which aspects are active in the current scene
- Show players the visible aspects (hiding secret ones)
- Record invocations and compels with FP cost/gain
- Clear scene aspects on transition while keeping persistent ones
- Pull suggested aspects from vault scene docs without a full Claude call

This feature turns `/aspects` into a subcommand group backed by PostgreSQL, making aspects first-class tracked objects in the bot.

## Design

### Subcommand Group Structure

`/aspects` becomes a subcommand group with 8 subcommands:

| Subcommand | Access | Visibility | Purpose |
|-----------|--------|-----------|---------|
| `generate [subject]` | GM | Ephemeral | Current behavior: Claude generates suggested aspects |
| `suggest` | GM | Ephemeral | Pull aspects from active scene doc / entity cards / location notes in vault DB |
| `add [text] [type] [source?] [severity?]` | GM | Public (hidden type: ephemeral) | Pin an aspect to the active scene |
| `list` | All | Role-based | Show active aspects; players see visible only, GM sees all |
| `invoke [aspect] [player]` | All | Public | Mark an aspect as invoked by a player (-1 FP) |
| `compel [aspect] [player]` | GM | Public | Compel an aspect on a player (+1 FP) |
| `remove [aspect]` | GM | Ephemeral | Remove a single aspect from active play |
| `clear` | GM | Ephemeral confirmation, public announcement | Clear all non-persistent aspects (scene transition) |

### Aspect Types

Enum with 9 values covering all FATE aspect categories relevant to Nova Praxis:

| Type | Description | Cleared on scene transition? |
|------|------------|------------------------------|
| `scene` | Core scene aspects (e.g., "Flickering Emergency Lights") | Yes |
| `hidden` | GM-only scene aspects, invisible to players | Yes |
| `dynamic` | Aspects created mid-scene by fiction/consequences | Yes |
| `consequence` | Stress consequences on characters (mild/moderate/severe/extreme) | Only mild; others persist |
| `persistent` | Campaign or arc aspects that survive scene changes | No |
| `zone` | Attached to a specific zone in the scene | Yes |
| `maneuver` | Created via Create Advantage action, typically one free invoke | Yes |
| `character` | Permanent character aspects (high concept, trouble, etc.) | No |
| `equipment` | Gear/sleeve aspects (e.g., "Military-Grade Mesh Armor") | No |

### Player Access Rules

Players can:
- `/aspects list` — See all aspects **except** `hidden` type
- `/aspects invoke` — Invoke any **visible** aspect on **their own character** (matched by `discord_user_id` in `characters` table)

GM can do everything. The `requireGM()` middleware gates `generate`, `suggest`, `add`, `compel`, `remove`, and `clear`.

For `invoke`, the check is: caller is GM **or** the `player` option matches the caller's linked character. If a player tries to invoke on someone else's character, reject with ephemeral error.

## Schema

### Migration: `session_aspects` table

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
    source          TEXT,                       -- NPC name, location, zone, etc.
    severity        aspect_severity,            -- only for consequence type
    free_invokes    INT NOT NULL DEFAULT 0,     -- free invokes remaining (maneuvers get 1)
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    removed_at      TIMESTAMPTZ
);

CREATE INDEX idx_session_aspects_session ON session_aspects (session_num);
CREATE INDEX idx_session_aspects_active ON session_aspects (session_num, active);
```

### Migration: `aspect_usage` table

```sql
-- Track invocations and compels
CREATE TABLE aspect_usage (
    id              SERIAL PRIMARY KEY,
    aspect_id       INT NOT NULL REFERENCES session_aspects(id) ON DELETE CASCADE,
    usage_type      TEXT NOT NULL CHECK (usage_type IN ('invoke', 'compel')),
    player_name     TEXT NOT NULL,              -- PC name (matches characters.name)
    discord_user_id TEXT,                       -- who clicked the command
    free            BOOLEAN NOT NULL DEFAULT false,  -- free invoke (no FP cost)
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aspect_usage_aspect ON aspect_usage (aspect_id);
```

### Why PostgreSQL over in-memory

- Sessions span 3-5 hours with potential bot restarts (deploys, crashes, Windows updates)
- Aspect state is the kind of thing players will dispute ("that was already invoked!") -- having a persistent log settles arguments
- The bot already has a PostgreSQL pool; adding two small tables is trivial
- Query patterns are simple (filter by session_num + active)
- No need for Redis or anything else

## Per-Subcommand Behavior

### `/aspects generate [subject]`

**Unchanged from current behavior**, but moved into the subcommand group.

- GM-only, ephemeral
- Calls `buildAspectsContext(subject)` -> `callClaude()` -> `gmResponseEmbed()`
- Add a row of buttons below the embed: one "Add to Scene" button per generated aspect (see Integration section)

**Option:** `subject` (string, required)

### `/aspects suggest`

**New. Reads vault DB instead of calling Claude.**

1. Get current session number via `getLatestSessionNum()`
2. Query `sessions` table for the current session's scene docs (`file_type = 'scenes'`), pulling the most recent scene's content
3. Regex-extract lines that look like aspects (lines starting with `- **`, aspect table rows, lines tagged with "Aspect:")
4. Also query `entity_cards` for NPCs referenced in the scene content, pull their `full_card` and extract aspect lines
5. Format as a bulleted list in an ephemeral embed
6. Each suggestion gets an "Add" button (same pattern as `generate`)

**No options.** Relies on current session state.

Fallback: if no scene docs found, reply "No active scene data found. Use `/aspects generate` instead."

### `/aspects add [text] [type] [source?] [severity?]`

**GM-only.**

1. Validate: if `type` = `consequence`, `severity` is required (error if missing)
2. Set `free_invokes` = 1 if `type` = `maneuver`, else 0
3. Insert into `session_aspects` with `session_num` from `getLatestSessionNum()`
4. If `type` = `hidden`: reply ephemeral with red embed confirming add
5. Otherwise: reply public with blue embed announcing the new aspect

**Options:**
- `text` (string, required) — The aspect text
- `type` (string choice, required) — One of the 9 aspect types
- `source` (string, optional) — Who/what it's attached to
- `severity` (string choice, optional) — For consequences: mild/moderate/severe/extreme

### `/aspects list`

**All players.**

1. Query `session_aspects WHERE session_num = $1 AND active = true`
2. For each aspect, count invocations and compels from `aspect_usage`
3. Build two embed sets:
   - **Visible embed** (blue, 0x5865f2): All aspects except `hidden` type
   - **Hidden embed** (red, 0xed4245): `hidden` aspects only, footer "GM Only"
4. If caller is GM: send visible embed as public reply, follow up with hidden embed as ephemeral
5. If caller is player: send visible embed as public reply only

**Display format** (code block table inside embed):

```
Aspect                          | Type        | Source       | Used
--------------------------------+-------------+--------------+------
Flickering Emergency Lights     | scene       |              |
Zero-G Combat Zone              | zone        | Cargo Bay    |
Bruised Ribs (Mild)             | consequence | Grace        | II
Hacked Security Grid            | maneuver    | Kestrel      | F
Corporate Surveillance          | persistent  |              | C
```

Legend in embed footer: `I = Invoked | C = Compelled | F = Free Invoke Used`

Each invocation adds an `I`, each compel adds a `C`, each free invoke consumed adds an `F`. Compact and scannable.

### `/aspects invoke [aspect] [player]`

**Players can invoke on their own character. GM can invoke for anyone.**

1. `aspect` option: autocomplete from active visible aspects (query `session_aspects WHERE active = true AND type != 'hidden'`)
2. `player` option: autocomplete from `characters` table
3. Permission check:
   - If caller is GM: proceed
   - If caller is player: look up `characters WHERE discord_user_id = interaction.user.id`. If the `player` option doesn't match their character name, reject ephemeral
4. Check `free_invokes > 0` on the aspect. If yes, decrement `free_invokes`, insert usage with `free = true`
5. If no free invokes: insert usage with `free = false` (costs 1 FP)
6. Reply public embed:

```
Aspect Invoked

"Hacked Security Grid" invoked by Kestrel
FP: -1 (paid) | or: FREE INVOKE
```

Embed color: green (0x57f287).

### `/aspects compel [aspect] [player]`

**GM-only.**

1. `aspect` option: autocomplete from all active aspects (including hidden — GM can compel a hidden aspect to reveal it)
2. `player` option: autocomplete from `characters` table
3. Insert usage record with `usage_type = 'compel'`
4. Reply public embed:

```
Aspect Compelled

"Corporate Surveillance" compelled on Grace
FP: +1 earned
```

Embed color: orange (0xe67e22).

If the compelled aspect was `hidden` type, the compel announcement reveals it exists (the text is shown publicly). The aspect's type stays `hidden` in the DB — the GM can change it with a remove + re-add if they want it visible going forward.

### `/aspects remove [aspect]`

**GM-only.**

1. `aspect` option: autocomplete from active aspects
2. Set `active = false, removed_at = now()` on the row
3. Reply ephemeral: "Removed: *{aspect text}*"

Soft delete — the row stays for session history.

### `/aspects clear`

**GM-only.**

1. Confirmation: reply ephemeral with a "Confirm Clear" button (prevent accidental wipes)
2. On confirm: `UPDATE session_aspects SET active = false, removed_at = now() WHERE session_num = $1 AND active = true AND type NOT IN ('persistent', 'character', 'equipment')`
3. Also clear `consequence` aspects where severity = `mild` (mild consequences clear between scenes per FATE rules). Moderate/severe/extreme consequences survive.
4. Post public embed: "Scene aspects cleared. {N} aspects removed. {M} persistent aspects remain."

Embed color: grey (0x95a5a6).

## Display Formats

### Embed Colors

| Context | Color | Hex |
|---------|-------|-----|
| Visible aspects (list) | Blurple | 0x5865f2 |
| Hidden aspects (list) | Red | 0xed4245 |
| Aspect added (public) | Blurple | 0x5865f2 |
| Aspect added (hidden) | Red | 0xed4245 |
| Invoke announcement | Green | 0x57f287 |
| Compel announcement | Orange | 0xe67e22 |
| Clear announcement | Grey | 0x95a5a6 |
| Generate/suggest results | Red (GM-only) | 0xed4245 |

### Autocomplete

The `aspect` option on `invoke`, `compel`, and `remove` uses Discord autocomplete. Register an autocomplete handler in `src/autocomplete.ts` that queries:

```sql
SELECT id, text FROM session_aspects
WHERE session_num = $1 AND active = true
  AND lower(text) LIKE lower($2 || '%')
ORDER BY created_at DESC LIMIT 25
```

The autocomplete value is the aspect `id` (integer), displayed as the aspect text. This avoids ambiguity when two aspects have similar names.

For `invoke` autocomplete, additionally filter `type != 'hidden'` (players can't see hidden aspects).

The `player` option autocomplete reuses the existing character autocomplete pattern from `src/autocomplete.ts`.

## Integration Points

### "Add to Scene" buttons on `generate` and `suggest`

After Claude generates aspects or the suggest command extracts them, parse the output to identify individual aspect texts. For each (up to 5), add a button with `customId = aspect_add_{index}`.

Store the parsed aspects in the same in-memory cache pattern used by the Share with Players feature (UUID-keyed map, 15-minute TTL). On button click:

1. Look up the cached aspect text
2. Prompt the GM with a modal (or use defaults): type = `scene`, source = empty
3. Insert into `session_aspects`
4. Reply ephemeral confirming the add

If >5 aspects are generated, show the first 5 as buttons and include a note: "Use `/aspects add` for additional aspects."

### `/scene` auto-population

When `/scene` runs and generates output, the bot should:

1. Parse the Claude response for aspect lines (same extraction logic as `suggest`)
2. Cache them for "Add to Scene" buttons (same as `generate`)
3. Include the buttons on the scene response embed

This does NOT auto-insert aspects. The GM clicks to confirm each one. Auto-inserting would create noise if the GM rejects some suggestions.

### `/recap` integration

When building recap context in `buildRecapContext()`, query active aspects:

```sql
SELECT text, type, source FROM session_aspects
WHERE session_num = $1 AND active = true
ORDER BY type, created_at
```

Append as a section to the recap prompt:

```
## Active Aspects
- [scene] Flickering Emergency Lights
- [zone] Zero-G Combat Zone (Cargo Bay)
- [consequence] Bruised Ribs — mild (Grace)
- [persistent] Corporate Surveillance
```

This gives Claude context about the current tactical state when generating recaps.

### Queryable by other features

Export a `getActiveAspects(sessionNum: number)` function from `src/db/queries.ts` that returns all active aspects for a session. Any command that needs tactical context can call it.

## Files to Create

| File | Purpose |
|------|---------|
| `src/commands/aspects.ts` | Rewrite: subcommand group with all 8 handlers |
| `src/embeds/aspect-embeds.ts` | Embed builders for list, invoke, compel, clear, add |
| `src/db/aspect-queries.ts` | All aspect-related DB queries (insert, list, update, usage tracking) |
| `migrations/002_session_aspects.sql` | Schema migration for both tables + enums |

## Files to Modify

| File | Change |
|------|--------|
| `init.sql` | Append the new table definitions (or keep separate migration file) |
| `src/db/queries.ts` | Add `getActiveAspects()` export, update `getTableCounts()` to include new tables |
| `src/autocomplete.ts` | Add autocomplete handlers for aspect text and aspect ID |
| `src/claude/context.ts` | Update `buildRecapContext()` to include active aspects |
| `src/index.ts` | Add button interaction handler for "Add to Scene" buttons (if not already present from Share with Players) |
| `src/commands/scene.ts` | Add "Add to Scene" buttons to scene output |

## Testing Plan

### Schema

1. Run migration on dev database — verify tables, enums, indexes, and foreign key created
2. Insert test aspects, verify `free_invokes` default and `active` default
3. Insert a `consequence` without severity — verify application-level validation rejects it

### Subcommands — Happy Path

4. `/aspects add "Flickering Lights" scene` — verify row inserted, public blue embed
5. `/aspects add "Ambush Planned" hidden` — verify ephemeral red embed, row has `type = 'hidden'`
6. `/aspects add "Bruised Ribs" consequence source:"Grace" severity:mild` — verify severity stored
7. `/aspects add "Flanking Position" maneuver source:"Kestrel"` — verify `free_invokes = 1`
8. `/aspects list` (as GM) — verify visible public embed + hidden ephemeral embed, code block table format
9. `/aspects list` (as player) — verify only visible aspects shown, no hidden embed
10. `/aspects invoke "Flanking Position" "Kestrel"` — verify free invoke consumed, `free_invokes` decremented, green embed says "FREE INVOKE"
11. `/aspects invoke "Flanking Position" "Kestrel"` again — verify paid invoke, green embed says "FP: -1"
12. `/aspects compel "Flickering Lights" "Grace"` — verify orange embed, usage record with `usage_type = 'compel'`
13. `/aspects remove "Flickering Lights"` — verify soft delete (`active = false`), ephemeral confirmation
14. `/aspects clear` — verify confirmation button appears, on confirm: scene/zone/maneuver/dynamic/hidden + mild consequences cleared, persistent/character/equipment + moderate+ consequences survive
15. `/aspects generate "docking bay ambush"` — verify Claude called, ephemeral response with "Add to Scene" buttons
16. `/aspects suggest` — verify vault DB queried, extracted aspects listed with "Add" buttons

### Permissions

17. Player runs `/aspects add` — rejected with "GM-only"
18. Player runs `/aspects invoke` on their own character — allowed
19. Player runs `/aspects invoke` on another player's character — rejected
20. Player runs `/aspects compel` — rejected with "GM-only"
21. Player runs `/aspects remove` — rejected with "GM-only"

### Integration

22. Run `/scene "cargo bay breach"` — verify "Add to Scene" buttons on scene output
23. Click "Add to Scene" button — verify aspect inserted and confirmed
24. Run `/recap` — verify active aspects included in recap context
25. Restart bot, run `/aspects list` — verify aspects survived restart (PostgreSQL persistence)

### Edge Cases

26. `/aspects add` with duplicate text — allow it (same aspect text can exist multiple times, e.g., two zones with same name)
27. `/aspects clear` with no active aspects — "No aspects to clear"
28. `/aspects invoke` on a removed aspect — autocomplete shouldn't show it; if forced, reject with "Aspect not active"
29. `/aspects list` with no aspects — "No active aspects this session"
30. `suggest` with no scene data — "No active scene data found"
