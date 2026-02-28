# Claude Code - GM Runtime System

Use this to run in-character dialogue and rapid lore lookups with Claude Code (desktop app, no API required).

## Goal

- Fast GM assistance at table speed.
- Responses grounded in your vault canon and extracted PDFs.
- Distinct speech styles by entity type.
- Short, playable responses by default.

## Recommended Workflow (No API)

1. Open Claude Code in this vault root.
2. Keep these files visible in one split pane:
   - [[GM AI/NPC Command Board]]
   - [[GM AI/Claude Code - Persona & Complexity Matrix]]
   - [[GM AI/Entity Card Template]]
   - [[GM AI/Claude Code - Prompt Pack]]
3. When an NPC/agent speaks, paste a compact runtime prompt from the Prompt Pack.
4. For lore checks, ask Claude to prefer these source files first:
   - `pdf_full_extract.txt`
   - `machinations_full_extract.txt`
   - Session and faction notes in your vault
5. If uncertain, Claude should state uncertainty and give the most plausible in-canon option.

## Hard Rules for Runtime

- Keep replies concise unless you ask for detail.
- Stay in-canon; no retcons without explicit GM approval.
- Distinguish what the speaker knows vs what is true.
- Use entity rank complexity to control depth, strategy, and deception.

## Suggested Vault Layout

- `GM AI/Claude Code - GM Runtime System.md` (this file)
- `GM AI/Claude Code - Prompt Pack.md`
- `GM AI/Claude Code - Persona & Complexity Matrix.md`
- `GM AI/Entity Card Template.md`
- `GM AI/Entity Cards/` (one file per major recurring entity)

## At-Table Loop (20-second cycle)

1. Identify speaker + intent.
2. Pick entity type + complexity rank.
3. Use matching prompt block.
4. Get response in 1–4 lines.
5. If needed: ask for “same meaning, sharper tone” or “same tone, less words”.

## Reliability Pattern

When asking lore-heavy questions, prepend:

- "Use vault canon first, then `pdf_full_extract.txt` and `machinations_full_extract.txt`. If conflict exists, report both and pick one with rationale."

This keeps outputs consistent and audit-friendly.
