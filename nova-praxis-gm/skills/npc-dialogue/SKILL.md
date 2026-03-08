---
name: npc-dialogue
description: "Auto-triggers when the user asks natural-language NPC dialogue questions. Detects patterns like: 'What would [NPC] say...', 'How would [NPC] respond...', '[NPC] tells the player...', 'What does [NPC] think about...', 'How does [NPC] react to...', or any question framed as an NPC speaking, reacting, or thinking in-scene. Also triggers on mentions of specific NPC names: Kestrel, Nowak, Chimera, Valare, Seren, Kal, Paddock, Lighthouse, Royce, Patch, Yuen, Mira, Nola, Sera, Udo."
---

# NPC Dialogue Mode

When the user asks a natural-language question about what an NPC would say, think, or do — without using `/npc` — activate this mode automatically.

## Detection Patterns

Activate when the user's message:
- Starts with or contains "What would [name] say..."
- Contains "How would [name] respond/react/answer..."
- Contains "[name] tells/says/replies/asks..."
- Asks about NPC motivation, intent, or hidden knowledge in-scene
- Mentions a known NPC name in the context of dialogue or in-scene behavior

## NPC Resolution

Identify the NPC from the message and load their entity card:

| Name Variants | Entity Card |
|--------------|-------------|
| Kestrel | `GM AI/Entity Cards/R4/Kestrel (R4 Important NPC).md` |
| Nowak, Isabella | `GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC).md` |
| Chimera | `GM AI/Entity Cards/R5/Chimera (R5 Villain).md` |
| Valare Fork, the fork | `GM AI/Entity Cards/R4/Valare Fork (R4 Important NPC).md` |
| Valare, Valare Integrated | `GM AI/Entity Cards/R4/Valare Integrated (R4 Personal Agent Ally).md` |
| Seren, Talon | `GM AI/Entity Cards/R3/Seren (R3 Important Contact).md` |
| Kal, Paddock | `GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact).md` |
| Lighthouse, Lighthouse Controller | `GM AI/Entity Cards/R3/Lighthouse Tactical Controller (R3 Systems Agent).md` |
| Royce, Declan Royce | `GM AI/Entity Cards/R3/Declan Royce (R3 Centurion).md` |
| Patch, Yuen, Declan Yuen | `GM AI/Entity Cards/R1/Declan Yuen (R1 Docking Bay Mechanic).md` |

If the name doesn't match, search `GM AI/Entity Cards/` and `Characters/Named NPCs/`.

## Voice Generation Protocol

1. **Read the entity card** — Identity, Voice Profile, Motivations, Knowledge Boundaries, Runtime Defaults
2. **Apply Persona & Complexity Matrix** from `GM AI/Claude Code - Persona & Complexity Matrix.md`:
   - Match class for tone/cadence/lexicon
   - Match rank for dialogue length and complexity
3. **Check session state** — read most recent session dashboard for continuity
4. **Generate dialogue** using the NPC's actual voice:
   - Use their signature phrasing
   - Avoid words they avoid
   - Respect knowledge boundaries (hide what they must hide)
   - Serve their goals with every line

## Dialogue Length by Rank

- R1-R2: 1-2 sentences, direct, no subtext
- R3: 2-4 sentences, one implied motive
- R4: 2-5 sentences, double-layer meaning, strategic ambiguity
- R5: 2-5 sentences, composed pressure, misdirection

## Response Format

> [In-character dialogue lines]

**Intent:** [What the NPC is trying to achieve — one line]

**Hidden truth (GM-only):** [What they're hiding or really thinking — one line]

## Constraints

- Stay in-canon with vault notes and session state.
- Distinguish speaker knowledge vs. truth.
- Never break character voice.
- If canon is uncertain, include a confidence note.
- Keep continuity with prior session events.
