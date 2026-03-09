# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An Obsidian vault for GMing a FATE-based Nova Praxis campaign. It combines worldbuilding notes, session logs, mechanics references, GM AI integration prompts, structured TypeScript data files, and an embedded SvelteKit character creator app.

## Content Authoring Rules

All vault markdown must follow the Conni Mode conventions defined in `Templates/Conni Mode.md`:

- **Paste-ready Obsidian Markdown** — wikilinks for all proper nouns and core concepts
- **Link to existing notes** rather than re-explaining; use specific paths like `[[Factions/Houses/House Silva]]`
- **New terms** should either link to `[[Glossary/Index]]` or propose a new glossary entry name
- **Note structure**: H1 title, short summary, Lore section, Mechanics section, Continuity section, Links block
- **Tags**: light tagging only (a few relevant ones)
- **Don't force Fate terms** unless explicitly asked for Fate framing
- **Labeled assumptions** instead of asking questions; ask max 1 question only if truly blocked
- **Tone**: transhuman, post-scarcity edges, corporate/memetic power, identity continuity

## Vault Architecture

| Folder | Purpose |
|--------|---------|
| `Characters/` | Player characters (6 PCs) and `Named NPCs/` |
| `Factions/` | Houses, Aliens, Religion, Ideologies, Subsidiaries, Hidden Agendas |
| `Locations/` | Stations, planets, virtual spaces |
| `Glossary/` | 100+ term definitions — the canonical terminology index |
| `Sessions/` | Session logs and situation tracking |
| `Campaign Overview/` | Timeline, recap, arc summaries |
| `Plot/` | Mission frameworks, situations, subplots |
| `Rules and Mechanics/` | Active rules reference (parallel `Mechanics/` folder exists — legacy) |
| `Data/` | TypeScript data files (augmentations, gear, skills, sleeves, houses, states, fate-ladder) |
| `GM AI/` | Claude Code runtime prompts for at-table use |
| `Templates/` | 10 templates including Conni Mode system prompt |
| `Archive/` | Deprecated factions, locations, and SWADE-era content |
| `_Assets/Scripts/` | `conni_audit.ps1` (vault health audit), `create_glossary.py` |

## GM AI Runtime System

The `GM AI/` folder contains a complete at-table workflow for Claude Code:

- **GM Runtime System** — 20-second response cycle, entity-type complexity matrix
- **Prompt Pack** — Pre-built prompts for rapid NPC dialogue
- **Persona & Complexity Matrix** — Speech styles and behavior by entity rank
- **Entity Card Template** — NPC stat blocks

Lore questions should prefer vault canon first, then `pdf_full_extract.txt` and `machinations_full_extract.txt`. Flag uncertainty rather than inventing answers.

## Natural-Language NPC Dialogue Mode

When the user asks natural-language questions such as:

- "What would Valare say to Grace if she asked X?"
- "How would Nowak answer this in scene?"

Claude Code should treat this as an **NPC dialogue request** and respond in this format by default:

1. **In-character line(s)** (1–4 lines, voice-accurate to the entity card)
2. **Intent:** one line explaining what the NPC is trying to do
3. **Hidden truth (GM-only):** one short line unless user asks to hide GM notes

Source priority for these answers:

1. `GM AI/Entity Cards/**/*.md`
2. `GM AI/Claude Code - Persona & Complexity Matrix.md`
3. Relevant session files under `Sessions/` (prefer active dashboard/runtime files)
4. Canon lore files and extracts (`pdf_full_extract.txt`, `machinations_full_extract.txt`)

Behavior constraints:

- Keep continuity with current session state and prior events.
- If canon is uncertain or conflicting, include a short confidence note.
- Distinguish established fact vs rumor/belief where relevant.
- Never break character voice unless the user explicitly asks for analysis mode.
- For polished prose, apply [[GM AI/Narrative Humanizer Mode]] as a post-pass.
- Do not apply Narrative Humanizer Mode to rules/mechanics adjudication outputs.

## Rules Adjudication Mode

When the user asks a mechanics/rules question (examples: Refresh, Fate Points, stunts, action economy, stress/consequences, state benefits), Claude Code should switch to **Rules Adjudication Mode**.

Default response format:

1. **Answer:** one clear ruling sentence first.
2. **Exceptions/Modifiers:** short bullets for edge cases and state/stunt modifiers.
3. **Source files checked:** bullet list of concrete files used.
4. **Confidence:** `high|medium|low` with one short reason.

Rules source priority (highest to lowest):

1. `Nova Praxis Rulebook (Cleaned).txt`
2. `pdf_full_extract.txt`
3. `Rules and Mechanics/*.md` (active rules only)
4. `Data/*.ts` (structured mirrors)
5. Glossary/templates/reference notes

Adjudication constraints:

- If two sources conflict, prefer the higher-priority source and explicitly note the conflict.
- Do not answer from a template or legacy note when a canonical source exists.
- For rules answers, always include at least one exception/modifier check (e.g., state bonuses, stunts, GM refresh override).
- Avoid absolute wording unless the source text is explicit.

## GM Cockpit Plugin (`nova-praxis-gm/`)

A Claude Code plugin providing slash commands, auto-activating skills, and specialized agents for at-table GM use.

**Slash Commands:**

- `/gm-start [session#]` — Bootstrap a session (loads context, NPCs, scene lineup)
- `/rules [question]` — Rules oracle with source citations and confidence rating
- `/npc [token] "[situation]"` — Voice-accurate NPC dialogue matching entity card and rank
- `/scene [description]` — Scene framing with zones, aspects, NPCs, compels
- `/recap` — Current session state summary in under 20 lines
- `/aspects [subject]` — Generate double-edged FATE Aspects for scenes, NPCs, consequences, maneuvers, etc.

**Skills (auto-activating):**

- `rules-adjudication` — Triggers on any mechanics/rules question asked naturally
- `npc-dialogue` — Triggers on "What would X say..." patterns
- `narrative-humanizer` — Triggers on requests to polish prose

**Agents:**

- `rules-oracle` — Deep multi-source rules research
- `npc-voice` — Rich contextual dialogue for R3+ NPCs

**Obsidian Dashboards:**

- `GM Dashboard.md` — Single-pane command center at vault root
- `Rules and Mechanics/Rules Quick Reference - Unified.md` — Consolidated cheat sheet
- `GM AI/NPC Roster - Active.md` — At-a-glance NPC roster with command tokens

## Character Creator App

Located at `nova-praxis-character-creator/`. SvelteKit + TypeScript + Vite.

```bash
cd nova-praxis-character-creator
npm run dev      # local dev server
npm run build    # production build (static adapter)
npm run preview  # preview production build
npm run check    # svelte-check type checking
```

Uses `marked` for markdown rendering. Static site generation via `@sveltejs/adapter-static`.

## Automation Scripts

- **`_Assets/Scripts/conni_audit.ps1`** — PowerShell vault audit: counts files, checks naming signals (underscores, ALL CAPS, brackets), scans frontmatter, wikilinks, aliases, code fences, heading hierarchies. Outputs `conni_audit.json`.
- **`_Assets/Scripts/create_glossary.py`** — Generates glossary index from vault notes.

## Git & Sync

- Auto-backup via `obsidian-git` plugin (commit messages: `vault backup: <timestamp>`)
- `.gitignore` covers `.trash/` and video files in `Mechanics/FATE/` and `Rules and Mechanics/FATE/`
- Branch: `main` only

## Auto-Save Routing

When generating vault content, **always save to the correct folder automatically** — do not just display the output. Use the Write tool to create the file at the canonical path. If the parent folder doesn't exist, create it.

### Routing Rules

| Content Type | Path Pattern | Naming Convention |
|-------------|-------------|-------------------|
| **Scene** | `Sessions/Session {N}/Scenes/Scene {NN} - {Title}.md` | Two-digit scene number, title case. Frontmatter: `session`, `scene`, tags `type/scene` |
| **Entity Card** | `GM AI/Entity Cards/R{N}/{Name} (R{N} {Class}).md` | Rank folder (R1–R5). Class = Minor NPC, Important NPC, Villain, etc. |
| **Named NPC** (lore page) | `Characters/Named NPCs/{Name}.md` | Title case full name. Tags: `character`, `NPC`, `named` |
| **Location** | `Locations/{Region}/{Name}.md` | Region subfolder if applicable (e.g., `Sol System/`, `Cere/`). Top-level if no region |
| **Glossary Entry** | `Glossary/{Term}.md` | Title case term name |
| **Session Doc** | `Sessions/Session {N}/Session {N} - {Type}.md` | Type = Game Summary, Beats, Guide, Live Dashboard, etc. |
| **Plot/Situation** | `Plot/Situations/{Name}.md` or `Plot/Subplots/{Name}.md` | Context-dependent |
| **Rules Reference** | `Rules and Mechanics/{Topic}.md` | Active rules only; never write to `Mechanics/` (legacy) |
| **PC Character Sheet** | `Characters/Players/{PC Name}/{PC Name} - FATE Character.md` | Match existing folder name |
| **Drone/Creature** | `Characters/NPCs/Drones and Creatures/{Name}.md` | For non-humanoid entities |
| **Vehicle** | `Characters/NPCs/Vehicles/{Name}.md` | For ships, mechs, etc. |

### Auto-Save Behavior

- **Always save generated content** to the correct path without being asked. If the user requests a scene, NPC, entity card, or location, write the file after generating it.
- **Announce the save path** briefly: "Saved to `Sessions/Session 9/Scenes/Scene 03 - The Ambush.md`"
- **Include proper frontmatter** matching the content type's conventions (tags, aliases, session/scene numbers, rank/class for entities).
- **Wikilink all proper nouns** in saved content per Conni Mode conventions.
- **If the session number is ambiguous**, check the most recent session folder or ask.
- **If a file already exists at that path**, warn before overwriting — offer to update instead.

## Key Conventions

- **Mechanics subsystems** must include: Trigger, Procedure, Inputs/Outputs, Failure handling, and one runnable example
- **Two rules folders exist**: `Rules and Mechanics/` (active) and `Mechanics/` (legacy overlap) — prefer `Rules and Mechanics/`
- **Data files** in `Data/` are TypeScript — used by both the character creator and as structured reference
- **Index.md** is the vault entry point; section-level `Index.md` files serve as Maps of Content (MOCs)
