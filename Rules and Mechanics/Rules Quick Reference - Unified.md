---
aliases:
  - rules quick ref
  - unified cheat sheet
  - gm rules reference
tags:
  - type/game-reference
  - type/rules
  - rules-system: FATE
---

# Rules Quick Reference - Unified

**Summary:** Consolidated at-table cheat sheet. Scan in under 30 seconds for any core mechanic. For deep rulings, use `/rules` in Claude Code.

---

## Core Mechanic

**4dF + Skill + Modifiers = Effort**
**Shifts = Effort - Difficulty**

| Result | Meaning |
|--------|---------|
| Effort >= Difficulty | Success |
| Effort < Difficulty | Failure |
| **Spin** (3+ Shifts) | Significant success — create an Effect Aspect |
| **Stall** (fail by 3+) | Spectacular failure |

---

## Actions (OCAD)

| Action | When | Roll Against |
|--------|------|-------------|
| **Overcome** | Remove obstacle, resist | GM difficulty |
| **Create Advantage** | Place/discover Aspect | GM difficulty or opposed |
| **Attack** | Deal stress | Defender's Effort |
| **Defend** | Block attack/advantage | Attacker's Effort |

**Create Advantage Results:**
- Success: New Aspect + 1 free invoke
- Spin: New Aspect + 2 free invokes
- Failure: Complication or cost

---

## Aspects, Invokes & Compels

**Invoke (spend 1 FP):** +2 to roll, OR reroll, OR create Block, OR make Declaration
**Compel (earn 1 FP):** Aspect causes trouble — accept complication or pay 1 FP to refuse

**Free Invocations:** Aspects created via Maneuvers, Spin, or inflicted Consequences — first use free

**Persistent Aspects (P):** Invoke/compel for +2/-2 or reroll WITHOUT spending FP. Blocks/Declarations still cost FP.

**Scope Limit:** 1 Aspect per scope per test (Character, Scene, Zone, Equipment, etc.). Persistent Aspects exempt.

**Therefore Rule:** "I have X, **therefore** it helps me do Y." If you need two chained assumptions, it's probably not valid.

---

## Fate Points & Refresh

- Start each session at your **Refresh Rating** (default 5, modified by state)
- FP do NOT carry over between sessions
- Pure state: Refresh +2
- Earn FP by accepting compels
- Spend FP to invoke aspects

---

## Stress & Consequences

**Stress Tracks:** Physical | Mental | System (Savants)
Stress fills boxes left to right. Track full + can't absorb = **Taken Out**.

| Consequence | Absorbs | Recovery | Persistent? |
|------------|---------|----------|-------------|
| Mild | 2 stress | Scene end | No |
| Moderate | 4 stress | Session end | No |
| Severe | 6 stress | Arc end | Yes (P) |
| Extreme | 8 stress | — | Yes (P) |

Consequences are Aspects — can be invoked/compelled. First use is free.
**Concession:** Surrender early = gain 1 FP, avoid permanent injury.

---

## Conflict (Fights, Chases, Stand-offs)

**Per Turn:** 1 Simple Action + 1 Free Action + Instant Actions (defense doesn't count against limit)

**Attack:** Defender rolls defense first → becomes attacker's Difficulty
**Damage:** Shifts + Weapon Rating (WR) - Armor Rating (AR) = Stress dealt (min 0)

**Movement:** Adjacent zone = Free Action. Two zones (Hustle) = -2 penalty to other actions.

**Blocks:** Prevent specific action. Opponent must beat Block Potency to proceed.

---

## Tests, Contests & Extended Actions

| Type | When | How |
|------|------|-----|
| **Test** | World pushes back | Roll vs GM difficulty |
| **Contest** | Opposed, single moment | Both roll; higher wins |
| **Extended** | Multi-roll big task | Mark = Difficulty x 3; accumulate Shifts |

**Extended Action Spin/Stall:**
- Spin: Reduce Mark by 1
- Stall: Catastrophic failure, can't continue

---

## Supplemental & Combined Actions

**Supplemental Action:** Do a second thing alongside Simple Action → -1 to primary test
**Combining Skills:** Roll primary, modified by secondary: higher = +1, lower = -1, same = +0

---

## Character States At-a-Glance

| State | Physical Skills | Refresh Mod | Key Benefit | Key Drawback |
|-------|----------------|-------------|-------------|-------------|
| **Pure** | 8 ranks (Ath/End/Per, max 5) | +2 | Carpe Diem stunt, +1 non-physical skill | Loses benefits if Apotheosized |
| **SIM** | 7 ranks (virtual only) | — | +1 SINC, +1 S.Eng, choice stunt | No physical body, lag penalties, needs drones |
| **Sleeved** | Set by sleeve | — | Sleeve augmentations, swappable bodies | Resleeving is mental attack (Edge 8) |

---

## FATE Ladder

| +8 Legendary | +5 Superb | +2 Fair | -1 Poor |
|---|---|---|---|
| +7 Epic | +4 Great | +1 Average | -2 Terrible |
| +6 Fantastic | +3 Good | 0 Mediocre | |

---

## Savant Programs (Quick Table)

| Program | Diff | Action | Key Effect |
|---------|------|--------|-----------|
| Access Memory | 3+SINC | Simple | Extract memories from mnemonic core |
| Augmented Unreality | 1+SINC | Simple | Create AR illusions |
| Blackout | 3+SINC | Simple | Blind target (upgrades: +Deaf, +Frozen) |
| Delve | 2+SINC | Simple | Crack CID, access records |
| Eminent Domain | 3+ | Simple | Seize computer systems briefly |
| Esper Lord | Varies | Simple | Control nanomachine swarm |
| Memory Hack | 3+SINC | Extended | Edit stored memories permanently |
| Oracle Patterning | 4±mesh | Simple | Predict future events |
| Overload | 3+SINC | Simple | Knock target unconscious |
| Pattern Scan | 4+intel | Simple | Reconstruct past events |
| Puppeteer | 2/Resolve+1 | Simple | Possess and control drone |
| Security Skim | 2+intel | Simple | View through security feeds |
| Stream of Consciousness | 2+SINC | Simple | Read surface thoughts |
| System Error | Target SINC | Simple | System/Hardware/Ego attack |
| System Invasion | 4/3+SINC | Simple | Seize control of systems/drones/people |

**Execution:** SINC test vs Program Difficulty. Fail = System Stress (shifts missed). Stall = fail + System Stress.

> For full program details: [[Rules and Mechanics/Savant Programs - Game Reference]]

---

## Economy

**Rep-Rating:** Used in Coalition space to acquire items. Fail = Rep Hit.
**Assets:** Used for black market / apostate trading. Direct test vs Cost.

---

## Resleeving

Moving ego to a new body = **mental attack (Edge 8)** vs Cohesion.

---

## GM Quick Moves

| Move | When |
|------|------|
| Twist the Aspect | Flip existing Aspect into danger |
| Split the Scene | Parallelize simultaneous actions |
| Flashback Invocation | Player spends FP to retroactively justify prep |
| Compel the Clock | Use time as pressure Aspect |
| Let NPCs Invoke | Enemies spend FP too |

---

**Full rules:** [[Rules and Mechanics/Gameplay]]

#ttrpg #nova-praxis #rules #quick-reference
