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

## Key Conventions

- **Mechanics subsystems** must include: Trigger, Procedure, Inputs/Outputs, Failure handling, and one runnable example
- **Two rules folders exist**: `Rules and Mechanics/` (active) and `Mechanics/` (legacy overlap) — prefer `Rules and Mechanics/`
- **Data files** in `Data/` are TypeScript — used by both the character creator and as structured reference
- **Index.md** is the vault entry point; section-level `Index.md` files serve as Maps of Content (MOCs)
