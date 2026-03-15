# Obsidian CLI Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Obsidian CLI operations into all 6 nova-praxis-gm plugin commands, replacing raw file operations where CLI provides wikilink resolution, backlink traversal, template application, and search index benefits.

**Architecture:** Each command `.md` file gets a new CLI preamble instruction block + updated procedural steps. Commands fall back to raw Read/Write/Grep when CLI is unavailable. Agents and skills are unchanged (agents can't use Bash).

**Tech Stack:** Obsidian CLI (v1.12.4+), kepano/obsidian-skills plugin (dependency), Claude Code plugin markdown commands

**Spec:** `docs/superpowers/specs/2026-03-14-obsidian-cli-integration-design.md`

---

## Chunk 1: Install obsidian-skills and bump plugin version

### Task 1: Install obsidian-skills plugin

**Files:**
- None modified (external plugin install)

- [ ] **Step 1: Install obsidian-skills from marketplace**

Run:
```bash
claude plugin marketplace add kepano/obsidian-skills
```

If that fails (marketplace not available), manual install:
```bash
git clone https://github.com/kepano/obsidian-skills.git /tmp/obsidian-skills
cp -r /tmp/obsidian-skills/skills/ "d:/ObsidianVaults/FATE - Nova Praxis/.claude/skills/"
```

- [ ] **Step 2: Verify installation**

Run:
```bash
ls ~/.claude/plugins/cache/*/obsidian/*/skills/obsidian-cli/SKILL.md 2>/dev/null || ls "d:/ObsidianVaults/FATE - Nova Praxis/.claude/skills/obsidian-cli/SKILL.md" 2>/dev/null
```

Expected: File exists at one of those paths.

### Task 2: Bump plugin version

**Files:**
- Modify: `nova-praxis-gm/.claude-plugin/plugin.json`

- [ ] **Step 1: Update version to 1.1.0**

```json
{
  "name": "nova-praxis-gm",
  "version": "1.1.0",
  "description": "GM cockpit for running Nova Praxis TTRPG sessions — rules oracle, NPC dialogue, scene framing, session state. Uses Obsidian CLI for vault-aware operations."
}
```

- [ ] **Step 2: Commit**

```bash
git add nova-praxis-gm/.claude-plugin/plugin.json
git commit -m "chore: bump nova-praxis-gm to 1.1.0 for CLI integration"
```

---

## Chunk 2: Update `/scene` command (largest change)

### Task 3: Rewrite scene.md with CLI operations

**Files:**
- Modify: `nova-praxis-gm/commands/scene.md`

- [ ] **Step 1: Add CLI preamble and update Scene Resolution Process**

Note: This rewrite intentionally removes the "read-only operation" constraint from the original file. The command now creates scene files in the vault using `obsidian create`.

Replace the entire content of `scene.md` with:

```markdown
---
name: scene
description: "Scene framing helper — set up or transition scenes with zones, aspects, NPCs, and suggested compels"
arguments:
  - name: description
    description: "Scene name, location, or description (e.g., 'docking bay confrontation'). If omitted, shows the next planned scene."
    required: false
---

# Scene Framing Helper

Help the GM set up or transition to a scene during play.

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for reading, creating, searching, and modifying vault files. The CLI provides wikilink resolution, template application, and backlink traversal. Fall back to Read/Write/Grep if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).

## Your Task

Frame the scene: **{{ description }}** (if blank, find the next unplayed scene from the session guide)

## Scene Resolution Process

### 1. Check for Pre-Planned Scenes

Use the CLI to search and read session files:

```bash
obsidian search query="{{ description }}" path="Sessions/" limit=5
```

Then read matching scene docs:

```bash
obsidian read file="Session N - Scenes and Zones"
obsidian read file="Session N - Guide"
obsidian read file="Session N - Beats (GM Runtime)"
```

If the description matches a planned scene, use that content as the base.

### 2. Enrich with Vault Data

For any location mentioned, use CLI lookups:

```bash
obsidian read file="[Location Name]"
obsidian backlinks file="[Location Name]"
obsidian read file="[Faction Name]"
```

For active NPC entity cards likely present in the scene:

```bash
obsidian read file="[NPC Name]"
```

### 3. Generate Scene Framework (if improvised)

If the scene is improvised (not pre-planned), generate a framework using:
- Current session context and active plot threads
- Location details from vault
- Active faction pressures
- PC objectives and unresolved threads

### 4. Save Scene to Vault

After the scene content is ready (either from pre-planned sources or freshly generated), create the scene file:

```bash
obsidian create name="Scene [NN] - [Title]" template="Narrative Beat Template" path="Sessions/Session [N]/Scenes" silent
```

Then stamp frontmatter properties:

```bash
obsidian property:set name="session" value="[N]" path="Sessions/Session [N]/Scenes/Scene [NN] - [Title].md"
obsidian property:set name="scene" value="[NN]" path="Sessions/Session [N]/Scenes/Scene [NN] - [Title].md"
obsidian property:set name="tags" value="type/scene" path="Sessions/Session [N]/Scenes/Scene [NN] - [Title].md"
```

Append the generated scene content (zones, aspects, NPCs, compels) after the template structure:

```bash
obsidian append path="Sessions/Session [N]/Scenes/Scene [NN] - [Title].md" content="[generated content]" silent
```

Announce the save path: "Saved to `Sessions/Session N/Scenes/Scene NN - Title.md`"

## Response Format

---

**Scene: [Name]**
**Location:** [Where this takes place — 1 line]

**Zones:**
| Zone | Aspects |
|------|---------|
| [Zone name] | [Situation aspect(s) on this zone] |
| [Zone name] | [Situation aspect(s)] |

**Scene Aspects:**
- [Situation aspect — visible to players]
- [Hidden aspect — GM only, reveal on discovery]

**NPCs Present:**
| NPC | Token | Role in Scene | Opening Stance |
|-----|-------|--------------|----------------|
| [Name] | `[token]` | [Why they're here] | [Attitude/intent] |

**Clues Available:**
- [What can be discovered here — 1 line each]

**Suggested Compels:**
- [Aspect to compel] → [complication it creates]

**Transition Hooks:**
- [What leads to the next scene if this resolves cleanly]
- [What happens if this escalates]

---

## Constraints

- Prefer pre-planned scene content from session files over improvisation.
- All aspects should be playable (something a player can invoke or the GM can compel).
- Keep zone count to 2-4 (enough for tactical play, not overwhelming).
- NPC entries should include command tokens for fast `/npc` follow-up.
- After generating the scene, save it to the vault using `obsidian create`. Announce the save path.
- If the CLI is unavailable, fall back to Write tool for file creation.
```

- [ ] **Step 2: Verify the file renders correctly**

Read the file back to confirm formatting is intact.

- [ ] **Step 3: Commit**

```bash
git add nova-praxis-gm/commands/scene.md
git commit -m "feat(scene): wire Obsidian CLI for scene creation with templates and vault search"
```

---

## Chunk 3: Update `/npc` command

### Task 4: Update npc.md with CLI fallback and backlinks

**Files:**
- Modify: `nova-praxis-gm/commands/npc.md`

- [ ] **Step 1: Add CLI preamble after frontmatter**

Insert after line 8 (the closing `---`), before the `# NPC Dialogue Generator` heading:

```markdown

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for reading vault files. The CLI provides wikilink resolution (no need to know exact paths) and backlink traversal for continuity context. Fall back to Read/Grep if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).
```

- [ ] **Step 2: Update Step 1 MCP fallback to use CLI**

Replace lines 28 (the manual search fallback):

Old:
```markdown
If the token doesn't match, search `GM AI/Entity Cards/` and `Characters/Named NPCs/` manually.
```

New:
```markdown
If the MCP tools are unavailable or the token doesn't match, use CLI wikilink resolution:

```bash
obsidian read file="[NPC Name]"
```

This resolves the entity card regardless of rank folder. If CLI is also unavailable, search `GM AI/Entity Cards/` and `Characters/Named NPCs/` manually with Glob/Read.
```

- [ ] **Step 3: Add backlinks step and renumber in Step 2 voice generation**

Insert after line 40 (end of "Check session context" bullet), before "Generate dialogue". Then renumber the existing step 4 ("Generate dialogue") to step 6 so the sequence reads: 1, 2, 3, 4 (session context), 5 (backlinks — new), 6 (generate dialogue).

```markdown
5. **Check continuity via backlinks** — use CLI to find prior session references:
   ```bash
   obsidian backlinks file="[NPC Name]"
   ```
   Filter results to `Sessions/` and `Plot/` paths only. Skip Glossary, Factions, and Location backlinks unless specifically relevant to the current situation. Use this for continuity awareness — prior events, promises made, grudges held.
```

- [ ] **Step 4: Update Persona Matrix read to use CLI**

Replace line 37:

Old:
```markdown
2. **Apply the Persona & Complexity Matrix** from `GM AI/Claude Code - Persona & Complexity Matrix.md`:
```

New:
```markdown
2. **Apply the Persona & Complexity Matrix** (load via `obsidian read file="Persona & Complexity Matrix"`):
```

- [ ] **Step 5: Commit**

```bash
git add nova-praxis-gm/commands/npc.md
git commit -m "feat(npc): add CLI wikilink resolution, backlink continuity, and graceful fallback chain"
```

---

## Chunk 4: Update `/gm-start` command

### Task 5: Update gm-start.md with CLI file discovery

**Files:**
- Modify: `nova-praxis-gm/commands/gm-start.md`

- [ ] **Step 1: Add CLI preamble after frontmatter**

Insert after line 8 (the closing `---`), before the `# GM Session Bootstrap` heading:

```markdown

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for reading and discovering vault files. The CLI provides wikilink resolution and file listing with sort/filter. Fall back to Read/Glob if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).
```

- [ ] **Step 2: Update session auto-detection**

Replace line 16:

Old:
```markdown
Bootstrap session: **{{ session }}** (if blank, find the highest-numbered `Sessions/Session N/` folder)
```

New:
```markdown
Bootstrap session: **{{ session }}** (if blank, use `obsidian files path="Sessions" sort=modified limit=1` to find the most recent session folder)
```

- [ ] **Step 3: Update Step 1 to use CLI file listing**

Replace lines 22-31 (Step 1: Locate Session Files):

Old:
```markdown
### Step 1: Locate Session Files

Find and read these files for the target session (substitute N for session number):

1. `Sessions/Session N/Session N - Ops Index.md` — master launchpad
2. `Sessions/Session N/Session N - Guide.md` — primary runbook
3. `Sessions/Session N/Session N - Scenes and Zones.md` — scene framing + zones
4. `Sessions/Session N/Session N - GM Command Board.md` — live state tracker (if exists)
5. `Sessions/Session N/Session N - Live Dashboard.md` — real-time state (if exists)
6. `Sessions/Session N/Session N - Beats (GM Runtime).md` — beat-by-beat detail (if exists)

If any file doesn't exist, skip it and note what's missing.
```

New:
```markdown
### Step 1: Locate Session Files

List all files in the session folder, then read each one:

```bash
obsidian files path="Sessions/Session N" sort=modified
```

Read each file found using CLI wikilink resolution:

```bash
obsidian read file="Session N - Ops Index"
obsidian read file="Session N - Guide"
obsidian read file="Session N - Scenes and Zones"
obsidian read file="Session N - GM Command Board"
obsidian read file="Session N - Live Dashboard"
obsidian read file="Session N - Beats (GM Runtime)"
```

If any file doesn't exist, skip it and note what's missing. If CLI is unavailable, fall back to Glob/Read with direct paths.
```

- [ ] **Step 4: Update Step 2 arc context to use CLI**

Replace line 36:

Old:
```markdown
- `Campaign Overview/Cold Start Syndicate - Campaign Summary.md` — arc brief + session highlights
```

New:
```markdown
```bash
obsidian read file="Cold Start Syndicate - Campaign Summary"
```
Arc brief + session highlights.
```

- [ ] **Step 5: Update Step 3 NPC loading to use CLI**

Replace lines 40-43:

Old:
```markdown
From the session guide and scenes, identify which NPCs appear in this session. Read their entity cards from `GM AI/Entity Cards/`.

Also read:
- `GM AI/Claude Code - Persona & Complexity Matrix.md` — voice rules for all entity types
```

New:
```markdown
From the session guide and scenes, identify which NPCs appear in this session. Read their entity cards using CLI wikilink resolution:

```bash
obsidian read file="[NPC Name]"
```

This finds the entity card regardless of rank folder. For each NPC identified, read their card.

Also load the voice rules:

```bash
obsidian read file="Persona & Complexity Matrix"
```

If CLI is unavailable, read entity cards from `GM AI/Entity Cards/` and `GM AI/Claude Code - Persona & Complexity Matrix.md` directly.
```

- [ ] **Step 6: Commit**

```bash
git add nova-praxis-gm/commands/gm-start.md
git commit -m "feat(gm-start): use CLI file listing and wikilink reads for session bootstrap"
```

---

## Chunk 5: Update `/rules`, `/recap`, `/aspects` commands

### Task 6: Update rules.md with hybrid CLI approach

**Files:**
- Modify: `nova-praxis-gm/commands/rules.md`

- [ ] **Step 1: Add CLI preamble after frontmatter**

Insert after line 8 (the closing `---`), before the `# Nova Praxis Rules Oracle` heading:

```markdown

## Vault Operations

Use a hybrid approach: `obsidian` CLI for vault markdown files (Rules and Mechanics, Glossary) and direct Read/Grep for extract files (`_Assets/Extracts/`). The extract files are 100K+ line raw text — CLI may not index them efficiently. Fall back entirely to Read/Grep if the CLI is unavailable or if CLI reads return ambiguous results.
```

- [ ] **Step 2: Update source priority with CLI instructions**

Replace lines 20-26 (Source Priority section):

Old:
```markdown
Search these sources in order. Stop as soon as you find an authoritative answer, but always check for modifiers/exceptions in lower sources:

1. **`Nova Praxis Rulebook (Cleaned).txt`** — Official rulebook (highest authority)
2. **`pdf_full_extract.txt`** — Full PDF extraction (broader context)
3. **`Rules and Mechanics/*.md`** — Active rules mirror files (27 files covering gameplay, states, augmentations, sleeves, skills, savant programs, firearms, armor, equipment, pneuma, drones, mnemonic editing)
4. **`Data/*.ts`** — TypeScript data files (augmentations.ts, gear.ts, nova-praxis-skills.ts, nova-praxis-states.ts, nova-praxis-sleeves.ts, fate-ladder.ts)
5. **`Glossary/`** — Term definitions
```

New:
```markdown
Search these sources in order. Stop as soon as you find an authoritative answer, but always check for modifiers/exceptions in lower sources:

1. **`Nova Praxis Rulebook (Cleaned).txt`** — Official rulebook (highest authority). Use direct Grep: `Grep pattern="[topic]" path="_Assets/Extracts/Nova Praxis Rulebook (Cleaned).txt"`
2. **`pdf_full_extract.txt`** — Full PDF extraction (broader context). Use direct Grep: `Grep pattern="[topic]" path="_Assets/Extracts/pdf_full_extract.txt"`
3. **`Rules and Mechanics/*.md`** — Active rules mirror files. Use CLI: `obsidian search query="[topic]" path="Rules and Mechanics/"` then `obsidian read file="[matched file]"`
4. **`Data/*.ts`** — TypeScript data files. Use direct Read (these aren't Obsidian notes)
5. **`Glossary/`** — Term definitions. Use CLI: `obsidian read file="[term]"` (wikilink resolution)
```

- [ ] **Step 3: Commit**

```bash
git add nova-praxis-gm/commands/rules.md
git commit -m "feat(rules): hybrid CLI/Grep approach — CLI for vault notes, Grep for extract files"
```

### Task 7: Update recap.md with CLI file discovery

**Files:**
- Modify: `nova-praxis-gm/commands/recap.md`

- [ ] **Step 1: Add CLI preamble after frontmatter**

Insert after line 4 (the closing `---`), before the `# Session Recap` heading:

```markdown

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for discovering and reading session files. Fall back to Glob/Read if the CLI is unavailable or if CLI reads return ambiguous results.
```

- [ ] **Step 2: Update source files section to use CLI**

Replace lines 14-23 (Source Files section):

Old:
```markdown
## Source Files (read in order)

1. Find the highest-numbered `Sessions/Session N/` folder
2. Read any of these that exist:
   - `Session N - GM Command Board.md` (live state)
   - `Session N - Live Dashboard.md` (real-time tracker)
   - `Session N - Ops Index.md` (master index)
   - `Session N - Guide.md` (session runbook)
   - `Session N - Scenes and Zones.md` (scene details)
3. Read `Campaign Overview/Cold Start Syndicate - Campaign Summary.md` for arc context
```

New:
```markdown
## Source Files (read in order)

1. Find the most recent session folder:
   ```bash
   obsidian files path="Sessions" sort=modified limit=5
   ```

2. Read session state files using CLI wikilink resolution:
   ```bash
   obsidian read file="Session N - GM Command Board"
   obsidian read file="Session N - Live Dashboard"
   obsidian read file="Session N - Ops Index"
   obsidian read file="Session N - Guide"
   obsidian read file="Session N - Scenes and Zones"
   ```
   Skip any that don't exist.

3. Read arc context:
   ```bash
   obsidian read file="Cold Start Syndicate - Campaign Summary"
   ```

If CLI is unavailable, fall back to Glob for `Sessions/Session */` folders and direct Read for each file.
```

- [ ] **Step 3: Commit**

```bash
git add nova-praxis-gm/commands/recap.md
git commit -m "feat(recap): use CLI file discovery and wikilink reads"
```

### Task 8: Update aspects.md with CLI reads and optional save

**Files:**
- Modify: `nova-praxis-gm/commands/aspects.md`

- [ ] **Step 1: Add CLI preamble after frontmatter**

Insert after line 8 (the closing `---`), before the `# Aspect Generator` heading:

```markdown

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for reading vault context (NPC entity cards, locations, factions). Fall back to Read/Grep if the CLI is unavailable or if CLI reads return ambiguous results.
```

- [ ] **Step 2: Update output constraints to add CLI reads and optional save**

Replace lines 104-108 (the last 5 bullets of Output Constraints):

Old:
```markdown
- Draw from vault lore: `Factions/`, `Locations/`, `Glossary/`
- If the subject is an NPC, read their entity card for personality-grounded aspects
- Total: 15-25 Aspects across all relevant categories
- No generic fantasy tropes — hard sci-fi transhumanism only
- Do NOT use long prose descriptions — tables only
```

New:
```markdown
- Draw from vault lore using CLI: `obsidian read file="[Faction/Location/Term]"` and `obsidian backlinks file="[subject]"` for connected context
- If the subject is an NPC, read their entity card: `obsidian read file="[NPC Name]"` (wikilink resolution finds it regardless of rank folder)
- Total: 15-25 Aspects across all relevant categories
- No generic fantasy tropes — hard sci-fi transhumanism only
- Do NOT use long prose descriptions — tables only
- After displaying aspects, if an active scene doc exists in the current session, offer to save them: `obsidian append file="[scene doc]" content="[aspects]" silent`. If no active scene doc, display only.
```

- [ ] **Step 3: Commit**

```bash
git add nova-praxis-gm/commands/aspects.md
git commit -m "feat(aspects): add CLI vault reads, backlink context, and optional save to scene doc"
```

---

## Chunk 6: Sync plugin and verify

### Task 9: Sync plugin to cache

**Files:**
- None modified (plugin management command)

- [ ] **Step 1: Update the plugin in Claude Code's cache**

```bash
claude plugin update nova-praxis-gm@nova-praxis-local
```

- [ ] **Step 2: Commit local marketplace**

```bash
cd C:\Users\satur\.claude\plugins\local-marketplace
git add -A && git commit -m "update nova-praxis-gm to 1.1.0 — CLI integration"
```

- [ ] **Step 3: Verify plugin loads**

Start a new Claude Code session and check that the updated commands are available. Run:
- `/recap` — should use `obsidian files` and `obsidian read` CLI commands
- `/rules "how does stress work"` — should use Grep for extracts, CLI for vault notes

### Task 10: Manual verification checklist

- [ ] **Step 1: Verify CLI is registered**

```bash
obsidian version
```

Expected: Version output (1.12.4+). If "command not found", register in Obsidian Settings > General > Register CLI.

- [ ] **Step 2: Test wikilink resolution**

```bash
obsidian read file="Nowak"
```

Expected: Returns content of Isabella Nowak's entity card.

- [ ] **Step 3: Test backlinks**

```bash
obsidian backlinks file="Nowak"
```

Expected: List of session docs, plot files, and other notes that reference Nowak.

- [ ] **Step 4: Test search**

```bash
obsidian search query="stress consequences" path="Rules and Mechanics/" limit=5
```

Expected: Returns matching rules files.

- [ ] **Step 5: Test template creation (dry run)**

```bash
obsidian create name="CLI Test Scene" template="Narrative Beat Template" path="Sessions" silent
```

Expected: Creates a new note from the Narrative Beat Template. Delete the test file after verification.

- [ ] **Step 6: Test fallback**

Close Obsidian. Verify that `/rules "how does stress work"` still works using Read/Grep fallback. Reopen Obsidian after test.
