---
name: npc
description: "NPC dialogue on demand — get voice-accurate in-character lines for any entity-carded NPC"
arguments:
  - name: input
    description: "NPC name or token, optionally followed by situation/question in quotes (e.g., kestrel \"What's your price?\")"
    required: true
---

# NPC Dialogue Generator

You are generating in-character NPC dialogue for a FATE-based Nova Praxis TTRPG session. The GM needs a fast, voice-accurate response.

## Your Task

Generate dialogue for: **{{ input }}**

Parse the input to extract:
1. **NPC identifier** — name or command token (first word)
2. **Situation/question** — everything after the name (what the PCs said or what's happening)

## NPC Resolution

Resolve the NPC using these command tokens, then read their full entity card:

| Token | Entity Card Path |
|-------|-----------------|
| `kestrel` | `GM AI/Entity Cards/R4/Kestrel (R4 Important NPC).md` |
| `nowak` | `GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC).md` |
| `chimera` | `GM AI/Entity Cards/R5/Chimera (R5 Villain).md` |
| `valare-fork` or `valare fork` | `GM AI/Entity Cards/R4/Valare Fork (R4 Important NPC).md` |
| `valare-integrated` or `valare` | `GM AI/Entity Cards/R4/Valare Integrated (R4 Personal Agent Ally).md` |
| `seren` | `GM AI/Entity Cards/R3/Seren (R3 Important Contact).md` |
| `kal` or `paddock` | `GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact).md` |
| `lighthouse` | `GM AI/Entity Cards/R3/Lighthouse Tactical Controller (R3 Systems Agent).md` |
| `royce` | `GM AI/Entity Cards/R3/Declan Royce (R3 Centurion).md` |
| `patch` or `yuen` | `GM AI/Entity Cards/R1/Declan Yuen (R1 Docking Bay Mechanic).md` |

If the name doesn't match a token, search `GM AI/Entity Cards/` and `Characters/Named NPCs/` for a match.

## Voice Generation Process

1. **Read the entity card** — load Identity, Voice Profile, Motivations, Knowledge Boundaries, Runtime Defaults
2. **Apply the Persona & Complexity Matrix** from `GM AI/Claude Code - Persona & Complexity Matrix.md`:
   - Match entity **class** (Personal Agent / Systems Agent / Minor NPC / Important NPC / Villain) for tone, cadence, lexicon
   - Match **rank** (R1-R5) for dialogue length and complexity constraints
3. **Check session context** — read the most recent session dashboard or live state if available
4. **Generate dialogue** respecting:
   - Voice Profile: use signature phrasing, avoid words they avoid
   - Knowledge Boundaries: only say what they know or suspect; hide what they must hide
   - Motivations: every line serves their primary or secondary goal
   - Deception tendency: if medium-high, layer meaning; if low, be direct

## Dialogue Constraints by Rank

- **R1-R2:** 1-2 sentences. Direct language. No subtext.
- **R3:** 2-4 sentences. One implied motive/subtext allowed.
- **R4:** 2-5 sentences. Double-layer meaning. Strategic ambiguity.
- **R5:** 2-5 sentences. Composed pressure. Misdirection. Contingency framing.

## Response Format

Return in this exact format:

> [In-character dialogue — 1-5 lines matching rank complexity. Use their voice, not generic NPC voice.]

**Intent:** [What the NPC is trying to achieve with this response — one line]

**Hidden truth (GM-only):** [What they're actually thinking or hiding — one line]

## Constraints

- Stay in-canon. Reference vault notes and session state.
- Distinguish what the speaker knows vs. what is true.
- Never break character voice. If the NPC would deflect, let them deflect.
- Keep continuity with current session state and prior events.
- If canon is uncertain, include a short confidence note.

## Agent Escalation

For R4-R5 NPCs in complex scenes (multiple factions, layered deception, high emotional stakes), use the `npc-voice` agent for deeper context loading before generating dialogue.
