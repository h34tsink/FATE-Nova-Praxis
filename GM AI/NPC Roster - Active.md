---
aliases:
  - npc roster
  - active npcs
  - npc list
tags:
  - gm-ai
  - runtime
  - npc
---

# NPC Roster - Active

**Summary:** At-a-glance roster for all NPCs in the current campaign arc. Use command tokens with `/npc` in Claude Code for instant dialogue.

---

## Active This Session (Session 9)

| NPC | Rank | Class | Faction | Token | Role in Arc | Current Stance |
|-----|------|-------|---------|-------|------------|---------------|
| [[GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC)\|Isabella Nowak]] | R4 | Important NPC | House Tsarya | `nowak` | Tsarya executive under siege | Needs PC help, bargaining with intel |
| [[GM AI/Entity Cards/R4/Kestrel (R4 Important NPC)\|Kestrel]] | R4 | Important NPC | House Kimura | `kestrel` | Kimura operative, information broker | Guarded, transactional, medium-high deception |
| [[GM AI/Entity Cards/R4/Valare Fork (R4 Important NPC)\|Valare Fork]] | R4 | Important NPC | Independent | `valare-fork` | The fork — consent/coercion decision | Hiding, defensive, trauma-aware, autonomy-focused |
| [[GM AI/Entity Cards/R4/Valare Integrated (R4 Personal Agent Ally)\|Valare Integrated]] | R4 | Personal Agent | Crew Ally | `valare` | PC crew's personal agent ally | Precise, protective, tactical compression |
| [[GM AI/Entity Cards/R5/Chimera (R5 Villain)\|Chimera]] | R5 | Villain | Unknown | `chimera` | Apex antagonist, identity destabilizer | Long-game manipulation, misdirection |

## Recurring NPCs

| NPC | Rank | Class | Faction | Token | Role | Status |
|-----|------|-------|---------|-------|------|--------|
| [[GM AI/Entity Cards/R3/Seren (R3 Important Contact)\|Seren]] | R3 | Important Contact | Talons of Freedom | `seren` | Talon contact, info conduit | Selective disclosure, controlled |
| [[GM AI/Entity Cards/R3/Lighthouse Tactical Controller (R3 Systems Agent)\|Lighthouse Controller]] | R3 | Systems Agent | Coalition | `lighthouse` | Station authority voice | Formal, procedural, by-the-book |
| [[GM AI/Entity Cards/R3/Declan Royce (R3 Centurion)\|Declan Royce]] | R3 | Centurion | Coalition | `royce` | Coalition enforcer | Tactical, measured responses |

## Background / Utility NPCs

| NPC | Rank | Class | Faction | Token | Role | Status |
|-----|------|-------|---------|-------|------|--------|
| [[GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact)\|Kal Paddock]] | R2 | Minor Contact | Local | `kal` | Local contact, utility NPC | Helpful, narrow context |
| [[GM AI/Entity Cards/R2/Mira Okafor (R2 Minor Contact)\|Mira Okafor]] | R2 | Minor Contact | — | — | Minor contact | — |
| [[GM AI/Entity Cards/R2/Nola Fisk (R2 Minor Contact)\|Nola Fisk]] | R2 | Minor Contact | — | — | Minor contact | — |
| [[GM AI/Entity Cards/R2/Sera Ivanova (R2 Minor Contact)\|Sera Ivanova]] | R2 | Minor Contact | — | — | Minor contact | — |
| [[GM AI/Entity Cards/R2/Udo Grein (R2 Minor Contact)\|Udo Grein]] | R2 | Minor Contact | — | — | Minor contact | — |
| [[GM AI/Entity Cards/R1/Declan Yuen (R1 Docking Bay Mechanic)\|Declan "Patch" Yuen]] | R1 | Minor NPC | Local | `patch` | Docking bay mechanic | Reactive, friendly, 1-line responses |

---

## Key Named NPCs (No Entity Card Yet)

These NPCs appear in `Characters/Named NPCs/` but don't have full entity cards. Consider creating cards if they become prominent.

- [[Characters/Named NPCs/Lester Lucas|Lester Lucas]]
- [[Characters/Named NPCs/Admiral Drivas|Admiral Drivas]]

> Add entity cards for any NPC who appears in 2+ sessions. Use [[GM AI/Entity Card Template]] as the base.

---

## Dialogue Quick Reference

**To get NPC dialogue in Claude Code:**
```
/npc [token] "[situation or player question]"
```

**Examples:**
- `/npc nowak "The PCs demand full disclosure before extraction"`
- `/npc chimera "Chimera contacts the PCs via anonymous mesh ping"`
- `/npc valare-fork "Grace asks why she was hiding at the station"`

**Or ask naturally:**
- "What would Kestrel say if the PCs offered double the fee?"
- "How does Nowak react to learning the mutineers have breached deck B?"

---

## Entity Rank Quick Guide

| Rank | Complexity | Dialogue Length | Subtext |
|------|-----------|----------------|---------|
| R1 | Reactive, simple | 1-2 lines | None |
| R2 | Clear goal, basic memory | 1-2 lines | None |
| R3 | Tactical, controlled | 2-4 lines | One implied motive |
| R4 | Multi-step planning | 2-5 lines | Double-layer meaning |
| R5 | Long-game manipulation | 2-5 lines | Misdirection, pressure |

---

## Links

- [[GM AI/Claude Code - Persona & Complexity Matrix]]
- [[GM AI/NPC Command Board]]
- [[GM AI/Entity Card Template]]
- [[GM Dashboard]]

#ttrpg #nova-praxis #gm-ai #npc
