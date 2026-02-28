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
