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

At-a-glance roster for all NPCs. Auto-updates from entity card frontmatter. Use `/npc [token] "[situation]"` in Claude Code for instant dialogue.

---

## All Entity Cards (Live)

```dataview
TABLE
  rank as "Rank",
  class as "Class",
  faction as "Faction",
  token as "Token",
  status as "Status"
FROM "GM AI/Entity Cards"
WHERE rank != null
SORT rank DESC
```

> New entity cards auto-appear here when you add `rank`, `class`, `faction`, `token`, and `status` to their frontmatter.

---

## By Rank (R4+ Priority NPCs)

```dataview
LIST
FROM "GM AI/Entity Cards"
WHERE rank = "R4" OR rank = "R5"
SORT rank DESC
```

## By Rank (R1-R3 Supporting Cast)

```dataview
LIST
FROM "GM AI/Entity Cards"
WHERE rank = "R1" OR rank = "R2" OR rank = "R3"
SORT rank DESC
```

---

## Key Named NPCs (No Entity Card Yet)

These NPCs appear in `Characters/Named NPCs/` but don't have full entity cards. Consider creating cards if they become prominent.

- [[Characters/Named NPCs/Lester Lucas|Lester Lucas]]
- [[Characters/Named NPCs/Admiral Drivas|Admiral Drivas]]

> Add entity cards for any NPC who appears in 2+ sessions. Use [[GM AI/Entity Card Template]] as the base.

---

## Dialogue Quick Reference

**Claude Code command:**

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
| ---- | ---------- | -------------- | ------- |
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
