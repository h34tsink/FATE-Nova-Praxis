---
aliases:
  - gm dashboard
  - gm cockpit
  - command center
tags:
  - gm-ai
  - runtime
  - dashboard
---

# GM Dashboard

Single-pane command center. Scan for state, use Claude Code for interactive queries.

---

## Claude Code Commands

| Command | What It Does | Example |
|---------|-------------|---------|
| `/gm-start` | Bootstrap session — loads all context | `/gm-start 9` |
| `/rules` | Rules oracle — ruling + source | `/rules can a SIM invoke aspects?` |
| `/npc` | NPC dialogue — voice-accurate | `/npc kestrel "What's your price?"` |
| `/scene` | Scene framing — zones, aspects, NPCs | `/scene docking bay confrontation` |
| `/recap` | Session state — where are we? | `/recap` |
| `/aspects` | Generate Aspects for any game element | `/aspects zero-g cargo bay firefight` |

---

## FATE Dice

> Roll 4 FATE/Fudge dice: `dice: 4dF`
> Roll with skill bonus: `dice: 4dF+3` (Good), `dice: 4dF+4` (Great), `dice: 4dF+5` (Superb)

| Value | Name | Value | Name | Value | Name |
| ----- | ---- | ----- | ---- | ----- | ---- |
| +8 | Legendary | +5 | Superb | +2 | Fair |
| +7 | Epic | +4 | Great | +1 | Average |
| +6 | Fantastic | +3 | Good | 0 | Mediocre |
| -1 | Poor | -2 | Terrible | | |

---

## Current Session

> [[Sessions/Session 9/Session 9 - Ops Index|Session 9 - Ops Index]] (master launchpad)

**Quick Links:**
- [[Sessions/Session 9/Session 9 - Guide|Session 9 Guide]]
- [[Sessions/Session 9/Session 9 - Scenes and Zones|Scenes & Zones]]
- [[Sessions/Session 9/Session 9 - GM Command Board|GM Command Board (Kanban)]]
- [[Sessions/Session 9/Session 9 - Live Dashboard|Live Dashboard]]

---

## Active NPCs (Live from Entity Cards)

```dataview
TABLE
  rank as "Rank",
  class as "Class",
  token as "Token",
  faction as "Faction"
FROM "GM AI/Entity Cards"
WHERE status = "active" AND rank != null
SORT choice(rank, "R5", 1, "R4", 2, "R3", 3, "R2", 4, "R1", 5) ASC
```

> Use `/npc [token] "[situation]"` in Claude Code for instant dialogue.

---

## Player Characters

| Player | Character | State | High Concept |
|--------|-----------|-------|-------------|
| Dan | [[Characters/Players/Aeddarius Crucial/Aeddarius Crucial - FATE Character\|Aeddarius Crucial]] | Pure | Aesthetic Aristocrat |
| Christa | [[Characters/Players/Azaria Dawson/Azaria Dawson - FATE Character\|Azaria Dawson]] | — | — |
| Matt | [[Characters/Players/Dr. Lorem (Doc) Ipsum/Dr. Lorem (Doc) Ipsum - FATE Character\|Dr. Lorem "Doc" Ipsum]] | — | — |
| Rob | [[Characters/Players/Dustin Halloway/Dustin Halloway - FATE Character\|Dustin "Grift" Halloway]] | — | — |
| Sara | [[Characters/Players/Grace Pryzbylski/Grace Pryzbylski - FATE Character\|Grace Pryzbylski]] | — | — |
| James | [[Characters/Players/Kallius/Kallius - FATE Character\|Kallius]] | — | — |

> Fill in State and High Concept from each PC sheet before Session 10.

---

## Session Tracker

- [ ] Scene 1: Echoes in Noise
- [ ] Scene 2: The Place She Hid
- [ ] Scene 3: Consent Conversation
- [ ] Scene 4: Fallout

**Exposure Clock:** `[ ] [ ] [ ] [ ] [ ]` (mark boxes as rumors spread)

---

## Quick Rules Links

| Topic | File |
|-------|------|
| **Unified Quick Reference** | [[Rules and Mechanics/Rules Quick Reference - Unified]] |
| Core Mechanics (4dF, Effort, Shifts) | [[Rules and Mechanics/Gameplay]] |
| Character States (Pure/SIM/Sleeved) | [[Rules and Mechanics/Character States]] |
| Skills | [[Rules and Mechanics/Skills]] |
| Augmentations | [[Rules and Mechanics/Augmentations]] |
| Sleeves | [[Rules and Mechanics/Sleeves]] |
| Savant Programs (SINC) | [[Rules and Mechanics/Savant Programs - Game Reference]] |
| Pneuma | [[Rules and Mechanics/Pneuma Rules/Index]] |
| Firearms | [[Rules and Mechanics/Firearms]] |
| Melee / Armor / Gear | [[Rules and Mechanics/Melee Weapons]] · [[Rules and Mechanics/Armor]] · [[Rules and Mechanics/Equipment]] |
| Drones | [[Rules and Mechanics/Drones Overview]] |
| Mnemonic Editing | [[Rules and Mechanics/Mnemonic Editing]] |

---

## Quick Stress & Consequences Reference

| Consequence | Absorbs | Recovery |
| ----------- | ------- | -------- |
| Mild | 2 | Scene end |
| Moderate | 4 | Session end |
| Severe (P) | 6 | Arc end |
| Extreme (P) | 8 | — |

**Damage:** Shifts + WR - AR = Stress (min 0)
**Taken Out:** Stress track full + can't take more Consequences
**Concession:** Surrender early = +1 FP

---

## Reference Links

- [[GM AI/Claude Code - Persona & Complexity Matrix]]
- [[GM AI/Claude Code - Prompt Pack]]
- [[GM AI/NPC Command Board]]
- [[GM AI/NPC Roster - Active]]
- [[Campaign Overview/Cold Start Syndicate - Campaign Summary]]
- [[GM Session Board]] — Kanban board for live session tracking
- [[Factions/Index]]
- [[Glossary/Index]]
- [[Characters/Index]]

#ttrpg #nova-praxis #gm-ai #dashboard
