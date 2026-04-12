---
title: Playing the Game — Quick Reference
tags:
  - rules/reference
  - gameplay
aliases:
  - Playing the Game Dashboard
  - Gameplay Quick Reference
cssclasses:
  - nova-reference
---

# Playing the Game — Quick Reference

> *"The mesh tracks everything. Fortunately, so do we."*

---

## Combat Actions

> [!tip] Ambushing
> Target has **no Skill on defense** — dice only. Armor Rating still applies. GM should roll defense for mooks.

> [!tip] Block Actions
> Declare what you're blocking + which Skill. Roll → set **Block Potency**.
> Anyone attempting the blocked action must beat Potency with a relevant Skill test (**Simple Action**).
> Success overcomes the block, but is treated as a **Supplemental Action** (-1 penalty).
>
> | Sample Block | Skill |
> |---|---|
> | Suppression Fire | Firearms |
> | Restrain | Melee or Athletics |
> | Distraction | Guile or Diplomacy |
>
> **Ignoring a Block:** Possible in some cases — GM may grant Blocker a free **Instant Action** response.

> [!tip] Full Defense
> Use a **Simple Action** to gain **+2 on all defense tests** until your next turn.
> If you haven't acted yet when attacked, you may declare Full Defense and forfeit your Simple Action.

> [!tip] Hold Your Action
> Delay your turn to act after another character.
> Hold through the full round → **go first next round**.
> Multiple held characters: **Strategy contest** to determine order.

> [!tip] Taking Aim
> **Simple Action** + Perception (Diff: 2) → place **In My Sights** Aspect on target.
> Invoke free on your next attack. Fragile — GM may require refresh if target moves erratically.

> [!tip] Taking Cover
> **Free Action** to move behind cover in your zone.
>
> | Cover Type | Result |
> |---|---|
> | **Light Cover** | Aspect: *Behind Light Cover* |
> | **Hard Cover** | Persistent Aspect: *Behind Hard Cover(P)* — can declare "I can't be hit" for 1 FP |

> [!tip] Push / Pull / Throw
> **Contested** Athletics + Size test.
> Win → target moves to adjacent zone of your choice.
> Larger attacker: can push extra zones up to (Size difference). Can follow as a **Free Action**.

> [!tip] Help from Others
> Helper rolls same Skill vs difficulty = primary character's Skill rank.
> **Success:** +1 bonus. **Spin:** +2 bonus. **Fail:** no effect. **Stall:** −1 penalty to primary character.

---

## Ranged Weapons

> [!abstract] Beam Weapons
>
> | Mode | Effect | Cost |
> |---|---|---|
> | **Beam Sweep** | Attack multiple targets; cumulative −1 per target | Firearms (Diff: 2 + targets) to avoid overheat |
> | **Overheat** | WR +3 | Spend 1 turn cooling after |
> | **Suppression Fire** | Block Action | — |

> [!abstract] Full-Auto Weapons
>
> | Mode | Effect | Cost |
> |---|---|---|
> | **Burst Fire** | WR +3 | Firearms (Diff: 2) or spend Simple Action reloading/cooling |
> | **Empty the Clip** | WR +5 | Burns entire magazine; must reload |
> | **Suppression Fire** | Block Action | — |
>
> *High Capacity Aspect: Invoke for Firearms (Diff: 3) to avoid empty-clip penalty.*

> [!abstract] Out of Ammo / Overheating
> GM may call a **Firearms test (Diff: 2)** at any time — higher if heavy use.
> **Fail:** spend Simple Action reloading or cooling.
> **Reload:** Supplemental Action if Simple Action wasn't an attack and ammo is available.

---

## Hazards & Damage

> [!warning] Falling
> Attack = dice + bonus (no Skill). Defend with **Endurance**.
> Athletics 3+ → +1 bonus to defense. Athletics 5+ → +2.
>
> | Distance | Attack Bonus |
> |---|---|
> | Up to 3m | +2 |
> | Up to 6m | +4 |
> | Up to 30m | +8 |
> | Up to 150m | +12 |
> | 300m+ (terminal velocity) | +18 (cap) |
>
> *Armor does not help unless it has a Hydrostatic Gel Layer.*

> [!warning] Fire & Environmental Hazards
> Attacks everyone in zone at start of each round. Dice + Intensity. Defend with **Endurance**.
>
> | Intensity | Description |
> |---|---|
> | 0 | Fire present but avoidable |
> | 3 | Waves of heat, most things burning |
> | 6 | Everything ablaze; direct flames |
> | 9 | Inferno |
>
> Direct ignition (flamethrower, etc.) = **Intensity 6**. Burning characters/objects have Aspect: *On Fire!*

> [!warning] Vacuum
> Treat as environmental hazard. **Intensity 6.** Defend with **Endurance**.
> Vacuum Suits grant safe exposure. Cybersleeves are immune.

> [!warning] Zero Gravity
> Zone has **Persistent Aspect: Zero-G(P)**.
> Can be invoked or compelled for any character in the zone.

> [!warning] Diseases & Viruses
> Contact triggers attack: Potency + dice (no Skill). Defend with **Endurance** (or **Software Engineering** for digital).
> **Lose → carrier. Suffer Consequence → carrier + victim.**
> Attacks repeat each day until cured. Spin on defense may end it.
>
> | Type | Defense Skill |
> |---|---|
> | Airborne / Contact | Endurance |
> | Digital Virus | Software Engineering |

> [!warning] Poisons & Drugs
> Both have **Potency** (resist with Endurance) and **Subtlety** (detect with Perception/Education).
>
> **Damaging Poisons:** Attack at start of your first turn after exposure; repeats each turn until end of scene or cured.
> Education (Diff: Potency + 2) to treat. Spin on defense may stop it.
>
> **Drugs:** Place Aspects directly on target (as Maneuver). Endurance vs Potency to resist.
> Fail → gain drug Aspects for listed duration. Not Consequences; won't push you toward Taken Out.

---

## Ego & Transhumanism

> [!danger] Resleeving / Becoming SIM
> **Mental attack, Edge 8.** Defend with Cohesion. Mnemonics engineer can aid.
>
> | Modifier | Edge Change |
> |---|---|
> | First resleeve ever | +2 |
> | Remember dying | +2 |
> | Resleeving into same/clone sleeve | −2 (defense bonus) |
>
> *SIM State(P) and Synthetic Biology(P) Aspects should be compelled during resleeving.*

> [!danger] Forking
> Highly illegal ([[Humanity Preservation Act]]) — punishable by death and erasure.
> Learning you've been forked: **mental attack, Edge +4.**
> Fork copy has all original's wants, skills, and relationships. Not a slave.

> [!danger] Merging
> Requires resurrection chamber.
> **Mental attack, Edge = total instances merged + trauma bonus.**
>
> | Worst Consequence of any instance | Trauma Bonus |
> |---|---|
> | Mild | +4 |
> | Moderate | +6 |
> | Severe | +8 |
> | Extreme | +10 |

> [!note] Mnemonic Editing
> Requires patient in deactivated SIM state + system with hostware.
> Mnemonics Skill test to **downgrade a Consequence** one step. Cannot target specific memories.
>
> | Consequence | Difficulty |
> |---|---|
> | Mild | 4 |
> | Moderate | 5 |
> | Severe | 6 |
> | Extreme | 7 |
>
> **Fail:** nothing changes. **Stall:** patient suffers mental stress equal to amount failed by.

---

## Economy & Reputation

> [!info] Purchasing Options
>
> | Method | When | Mechanic |
> |---|---|---|
> | **Assets** | Outside Coalition / black market | Assets test vs Cost. Fail = can't retry this session. Option to take Lasting Debt Aspect. |
> | **Reputation** | Coalition society | Cost < Rep-Rating: free. Cost ≥ Rep-Rating: roll Rep + dice vs Cost. Miss = Rep hit equal to difference. Max acquirable: Cost ≤ Rep-Rating × 2. |
> | **Trade** | Any | Item-for-item; Assets test (Diff = cost difference × 2) if values differ |
> | **Favors** | When Rep/Assets aren't enough | Networking test (Diff = Favor Value). See below. |

> [!info] Favors
> **Favor Value** = ½ item Cost (round up), or GM-determined for services.
>
> **House Networking:**
> - Success → Rep hit Value 1; favor granted
> - Fail → Favor granted (Rep hit = Favor Value) OR withdraw (Rep hit 1)
> - Stall → Not granted; Rep hit = Favor Value + possible Lasting Aspect (~1 week)
>
> **Apostate Networking:**
> - Success → Favor granted + *Tapped My Network* Lasting Aspect (~1 week)
> - Fail → Favor granted + *Tapped Out My Network(P)* (~1 month) OR withdraw (*Tapped My Network*, ~1 week)
> - Stall → *Tapped Out My Network(P)* + *Social Pariah* (~1 month each)

> [!info] Rep-Rating
> Track = circular wheel of boxes. Fill wheel → Rep-Rating +1, reset.
> **Bump:** mark boxes clockwise from current position (Value = your Rep-Rating, max you can give).
> **Hit:** erase boxes counter-clockwise. Empty wheel → Rep-Rating −1.
> Rating someone costs you a Rep hit of 1. Max Rep-Rating: **11**.

---

## Stealth & Infiltration

> [!example] Hiding
> Stealth vs Perception. Active searcher gains **+2** if they have reason and time to look.
> Hiding from [[Glossary/Monitor|Monitor]]: Stealth test (Diff: 3). Area's [[Glossary/Mesh|Mesh]] Aspect may modify.

> [!example] Shadowing (Moving Unseen)
> Stealth + Guile. Searchers gain bonus based on speed:
>
> | Movement | Detection Bonus |
> |---|---|
> | Normal | +4 |
> | Hustle | +6 |
> | Running | +8 |
>
> **Creeping:** Maneuver → *Creeping* Aspect (no test). Requires Supplemental Action each turn to maintain.

> [!example] Camouflage
> Hardware Engineering + Stealth (Diff: 2). Generate Shifts → add as bonus to hiding tests.
> Takes ~1 hour to construct.

---

## Gear & Repairs

> [!note] Repairs
> Hardware Engineering Extended Action (4 hrs/test). Difficulty = ½ item Cost.
> Items with Stress Tracks: remove Consequences via Engineering.
>
> | Consequence | Time | Difficulty |
> |---|---|---|
> | Mild | 1 day | 2 + Item Size |
> | Moderate | 1 week | 3 + Item Size |
> | Severe | 2 weeks | 4 + Item Size |
> | Extreme | 1 month | 5 + Item Size |
>
> Miss difficulty? Buy parts/labor at Cost = amount failed by.

> [!note] Programming
> Software Engineering Skill test (description = program). Success = Maneuver placing an Aspect.
> Only creator benefits unless the program is sent to others.
> Hostile programs face significant deployment barriers (CID security AI screening).

---

## Physical Rules

> [!abstract] Size & Weight
> **Lift capacity** = weight at your Size × Athletics skill. Athletics 0 → half capacity.
>
> | Load | Test Difficulty |
> |---|---|
> | Up to 150% of capacity | Athletics + 2 |
> | Up to 200% of capacity | Athletics + 4 |
> | Over 200% | Cannot lift |
>
> **Carrying:** counts as Supplemental Action.
> ≤ 50% lift cap → −1. > 50% → −2. > 100% → −3.

---

## Zones & Time

> [!abstract] Zones
> Same zone = hand-to-hand range. Adjacent zones = thrown/short range. 5–10 zones = weapon range limits.
> Use rough sketches, not grids. Zones represent relationships, not exact distances.
> Rooms, corridors, and open areas are natural zone boundaries.

> [!abstract] Time Increments
>
> | Increment | Approximate Duration |
> |---|---|
> | Instant | Immediate |
> | A Round | ~3 seconds |
> | A Scene | ~5 minutes |
> | An Hour | 60 minutes |
> | A Day | 24 hours |
> | A Week | 7 days |
> | A Month | 30 days |
> | Three Months | ~1 quarter |
> | A Year | 12 months |
> | Three Years | — |
> | A Decade | 10 years |
> | Forever | Permanent |
>
> *Generating Spin may reduce time required by one increment at GM discretion.*

---

*Source: [[_Assets/Extracts/Nova Praxis Rulebook (Cleaned).txt|Nova Praxis Rulebook]] — Playing the Game chapter*
*See also: [[Rules and Mechanics/Rules Quick Reference - Unified]] · [[GM Dashboard]]*
