---
name: scene
description: "Scene framing helper — set up or transition scenes with zones, aspects, NPCs, and suggested compels"
arguments:
  - name: description
    description: "Scene name, location, or description (e.g., 'docking bay confrontation'). If omitted, shows the next planned scene."
    required: false
---

## Vault Operations

Prefer Obsidian CLI commands (via Bash tool). On this system the CLI binary is `"C:/Users/satur/AppData/Local/Obsidian/Obsidian.com"` — use this path instead of `obsidian` in all Bash commands. Example: `"$LOCALAPPDATA/Obsidian/Obsidian.com" read file="Nowak"`. Prefer the CLI for reading, creating, searching, and modifying vault files. The CLI provides wikilink resolution, template application, and backlink traversal. Fall back to Read/Write/Grep if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).

# Scene Framing Helper

Help the GM set up or transition to a scene during play.

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
