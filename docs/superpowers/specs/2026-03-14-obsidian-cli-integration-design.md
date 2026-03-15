# Obsidian CLI Integration for nova-praxis-gm

**Date:** 2026-03-14
**Status:** Approved
**Scope:** Wire Obsidian CLI into existing GM plugin commands (Tier 2)

## Context

The Obsidian CLI (v1.12.4+, Feb 2026) provides command-line access to a running Obsidian instance. The kepano/obsidian-skills plugin teaches Claude Code the CLI syntax. This spec integrates CLI operations into the nova-praxis-gm plugin commands to replace raw file operations where the CLI is genuinely better.

### Why CLI Over Raw File Ops

- **Wikilink-style file resolution** — `obsidian read file="Nowak"` finds the file regardless of path or rank folder
- **Template application** — `obsidian create` applies Obsidian templates with proper frontmatter
- **Link-safe writes** — `obsidian move` and `obsidian append` preserve wikilink integrity
- **Backlink traversal** — `obsidian backlinks` returns all notes referencing a file (instant continuity context)
- **Search index** — `obsidian search` uses Obsidian's optimized local index, returns only relevant results
- **Property management** — `obsidian property:set` writes valid YAML frontmatter without manual parsing

### Prerequisites

1. **obsidian-skills plugin installed** — provides the `obsidian-cli` skill that teaches Claude all CLI commands
2. **CLI enabled in Obsidian** — Settings > General > Register CLI
3. **Obsidian running** during GM sessions (already the case)

### Dependency Model

The obsidian-cli skill (from kepano/obsidian-skills) teaches Claude the CLI syntax and common patterns. Our GM plugin commands reference CLI operations in their instructions — they don't duplicate CLI documentation. The two plugins are complementary: obsidian-skills teaches HOW to use the CLI, nova-praxis-gm teaches WHEN and WHY.

## Design: Per-Command Changes

### `/scene` — Largest Change

**Current:** Uses `Write` tool to create scene files with manually constructed frontmatter and content. Currently read-only (does not create files).

**Behavior change:** This upgrades `/scene` from read-only to write-capable. The existing "read-only operation" constraint in `scene.md` must be removed.

**New:**
1. Use `obsidian search` to find location/faction context for the scene
2. Use `obsidian create name="Scene {NN} - {Title}" template="Narrative Beat Template" path="Sessions/Session {N}/Scenes" silent` to create the scene file with proper template
3. Use `obsidian property:set` to stamp `session`, `scene` number, and tags (`type/scene`)
4. Use `obsidian append` to add generated scene content (zones, aspects, NPCs, compels) after template structure
5. Continue using `Read` for entity cards needed during scene generation (fast, already loaded)

**Template name:** `Narrative Beat Template` (must match exact filename in `Templates/` folder — verify with `obsidian files path="Templates"` during implementation)

### `/npc` — Moderate Change

**Current:** Path-based `Read` of entity cards from `GM AI/Entity Cards/R{N}/` folders. Requires knowing the rank folder. Step 1 attempts MCP tools (`get_entity_card`, `npc_prompt`) as fast path.

**New:**

1. **MCP fast path unchanged** — Step 1 still tries `get_entity_card` and `npc_prompt` MCP tools first if available
2. **CLI replaces manual fallback** — If MCP tools unavailable, use `obsidian read file="{NPC name}"` instead of path-based Read (wikilink resolution finds the entity card regardless of rank folder)
3. Use `obsidian backlinks file="{NPC name}"` — find session references for continuity context (new capability). **Limit to `Sessions/` and `Plot/` paths** to avoid blowing context with Glossary/Faction/Location backlinks
4. Apply Persona & Complexity Matrix via `obsidian read file="Persona & Complexity Matrix"` (wikilink resolution)

**Fallback chain:** MCP tools > CLI wikilink resolution > path-based search of `GM AI/Entity Cards/` with token matching

**New capability:** Backlink traversal provides automatic continuity context — session docs and plot files that reference this NPC are surfaced without a vault-wide grep.

### `/gm-start` — Moderate Change

**Current:** Manually locates session folders by path pattern, reads files individually.

**New:**

1. Use `obsidian files path="Sessions/Session {N}" sort=modified` to list all files in the session folder (scoped, avoids broad vault-wide matches)
2. Use `obsidian read file="{doc name}"` for each session doc (Guide, Beats, Scenes and Zones, Command Board, Live Dashboard)
3. Use `obsidian read file="Cold Start Syndicate - Campaign Summary"` for arc context
4. Use `obsidian files path="GM AI/Entity Cards"` to list entity cards, then read those with `status: active` in frontmatter
5. Use `obsidian read` for each active entity card

**Session auto-detection:** When no session number provided, use `obsidian files path="Sessions" sort=modified limit=1` to find the most recent session folder.

### `/rules` — Hybrid Approach

**Current:** `Grep` across rulebook extracts and rules markdown files.

**New (vault notes):**
1. Use `obsidian search query="{topic}"` for rules markdown files in `Rules and Mechanics/`
2. Use `obsidian read file="{rules page}"` for specific rules pages (e.g., `file="Gameplay"`, `file="Augmentations"`)
3. Use `obsidian search` for glossary term lookups

**Unchanged (extract files):**
- Keep direct `Read`/`Grep` for `_Assets/Extracts/Nova Praxis Rulebook (Cleaned).txt` and `_Assets/Extracts/pdf_full_extract.txt`
- These are 100K+ line raw text files, not standard Obsidian notes — CLI search may not index them efficiently
- The rulebook extract remains the highest-priority source

**Rationale:** The CLI excels at vault-native operations (notes with frontmatter, wikilinks, properties). The extract files are bulk reference text imported from PDFs — they benefit more from targeted `Grep` with line-level precision.

### `/recap` — Minor Change

**Current:** Manually navigates to latest `Sessions/Session {N}/` folder.

**New:**
1. Use `obsidian files path="Sessions" sort=modified limit=5` to find recent session docs
2. Use `obsidian read file="{dashboard/state file}"` for each state file
3. Use `obsidian read file="Cold Start Syndicate - Campaign Summary"` for arc context

### `/aspects` — Minor Change

**Current:** Reads NPC/location context, outputs aspects as text only (display-only, no file writes).

**Behavior change:** Adds optional save capability. Aspects are always displayed. If an active scene doc exists, offer to append them to it.

**New:**

1. Use `obsidian read file="{NPC/Location}"` for context lookup (wikilink resolution)
2. Use `obsidian backlinks file="{subject}"` for additional context from connected notes
3. Display generated aspects (unchanged output format)
4. If an active scene doc exists in the current session, offer to save: `obsidian append file="{scene doc}" content="{aspects}"`. If no active scene doc, display only

## What Does NOT Change

| Component | Reason |
|-----------|--------|
| **Response formats** | Table-based, scannable output stays identical — CLI changes inputs, not outputs |
| **Source priority chains** | Rules adjudication priority order unchanged |
| **Auto-triggering skills** | Detection patterns unchanged; skills delegate to updated commands |
| **Agents (rules-oracle, npc-voice)** | Agents use Read/Grep/Glob tools, not Bash — they can't call CLI. Keep as-is |
| **Rulebook extract searches** | Raw text files, not Obsidian notes — direct Grep is more precise |
| **Entity card structure** | Frontmatter schema (rank, class, faction, token, status) unchanged |
| **Dialogue constraints** | Rank-based complexity rules unchanged |
| **Canon priority** | Rulebook > vault markdown > data files > glossary — unchanged |

## Implementation Notes

### Command File Changes

Each command `.md` file gets updated instructions. The changes are to the procedural steps, not the output format or constraints. Specifically:

- Replace `Read tool with path="GM AI/Entity Cards/R4/Isabella Nowak..."` instructions with `obsidian read file="Nowak"` instructions
- Replace `Write tool to create file at path...` instructions with `obsidian create` instructions
- Add `obsidian backlinks` steps where continuity context is valuable
- Add `obsidian search` steps where vault-wide lookups replace `Grep`

### Error Handling

All CLI commands should include the instruction: "If the Obsidian CLI is not available (command not found, Obsidian not running), fall back to direct file operations using Read/Write/Grep tools."

This ensures the plugin works even when Obsidian is closed or CLI isn't registered.

**Ambiguous file resolution:** When `obsidian read file="..."` matches multiple notes (common vault names), the CLI may prompt or fail. In this case, fall back to path-based `Read` with the canonical vault path (e.g., `GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC).md`).

### New Instruction Block (Added to Each Command)

Each command gets a preamble instruction:

> **Vault operations:** Prefer `obsidian` CLI commands (via Bash tool) for reading, creating, searching, and modifying vault files. The CLI provides wikilink resolution, template application, and backlink traversal. Use `obsidian help` if unsure about a command. Fall back to Read/Write/Grep if the CLI is unavailable.

## Testing Plan

1. Verify CLI is registered: `obsidian version`
2. Test each command with a known entity: `/npc nowak "What do you want?"`
3. Verify scene creation uses template: `/scene "Docking Bay Confrontation"`
4. Verify backlinks work: check that `/npc` output includes continuity context from prior sessions
5. Verify fallback: close Obsidian, run `/rules "how does stress work"` — should fall back to direct file reads
6. Verify extract file searches still work: `/rules` questions that require rulebook extract
