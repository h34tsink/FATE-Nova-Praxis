---
tags:
  - type/player-handout
  - type/rules
  - type/table-reference
aliases:
  - "SWADE FATE Quick Reference"
  - "Migration Handout"
  - "Table Reference"
cssclasses:
  - table-reference
---

# SWADE to FATE — Table Reference

*Keep this at the table. Four pages: translation table, actions, Aspects & Fate Points, Nova Praxis specifics.*

---

## Page 1: Side-by-Side Translation

### Dice & Rolling

| SWADE | FATE |
|-------|------|
| Trait die (d4–d12) + Wild Die (d6) | **4dF + Skill rank** (range: -4 to +4 on dice) |
| Beat TN = Success | Beat Difficulty = Success; margin = **Shifts** |
| Raise (TN +4) | **Spin** (3+ Shifts) — create a free Effect Aspect |
| Snake eyes (Critical Failure) | **Stall** (fail by 3+) — spectacular failure |
| Acing (exploding dice) | No equivalent — the range is capped |

### Characters

| SWADE | FATE |
|-------|------|
| 5 Attributes (Agility, Smarts, etc.) | **No attributes** — skills stand alone |
| Skills linked to Attributes | Skills ranked +1 to +5 independently |
| Edges (mechanical bonuses) | **Stunts** (similar; some cost Refresh) |
| Hindrances (flaws for build points) | **Aspects** — double-edged, compelled for FP |
| Untrained = -2 penalty | Untrained = roll at +0 (Mediocre) |

### Economy

| SWADE | FATE |
|-------|------|
| Bennies: generic reroll or Soak | **Fate Points**: +2 or reroll, but must invoke a relevant Aspect |
| Bennies: spend to recover from Shaken | No Shaken state exists |
| Bennies may carry over | **FP never carry over** — reset to Refresh each session |
| Earn Bennies from GM reward, Jokers | **Earn FP from compels** on your Aspects |

### Damage

| SWADE | FATE |
|-------|------|
| Toughness (passive defense) | **AR** (Armor Rating) subtracts from stress |
| Shaken → must recover to act | No stunned state |
| 3 Wounds → Incapacitated | **Stress boxes** + **Consequences** absorb hits |
| Soak roll (Bennie + Vigor) | No Soak — Consequences absorb automatically |
| Incapacitated → Vigor roll | **Taken Out** → attacker narrates outcome |
| No equivalent | **Concede** — surrender early, keep narrative control, gain 1 FP |

### Initiative & Action Economy

| SWADE | FATE |
|-------|------|
| Draw cards for initiative | **Strategy** skill sets turn order |
| 3 actions with Multi-Action Penalty | **1 Simple Action + 1 Free Action** per turn |
| Support (+1 to ally) | Maneuver → place Aspect → ally invokes it for +2 |

---

## Page 2: FATE Actions Reference

### The Four Core Actions

| Action | Purpose | Roll Against | On Spin (3+ Shifts) |
|--------|---------|-------------|-------------------|
| **Overcome** | Remove obstacle, resist effect | GM Difficulty | Extra narrative benefit |
| **Create Advantage** | Place or discover an Aspect | GM Diff or Opposed | 2 free invokes instead of 1 |
| **Attack** | Deal stress to target | Defender's roll | Reduce Shifts by 1 to create Effect Aspect |
| **Defend** | Block an attack or advantage | Attacker's roll | — (reactive) |

### Other Actions

| Action | What It Does |
|--------|-------------|
| **Maneuver** | Place a temporary Aspect on scene or target (= Create Advantage) |
| **Assessment** | Discover a hidden existing Aspect (Perception, Insight, Research) |
| **Declaration** | Introduce a new story fact (spend FP or succeed on skill test) |
| **Block** | Set a potency — opponent must beat it to take a specific action |

### Turn Structure

**Each turn you get:**
- **1 Simple Action** (Attack, Overcome, Maneuver, etc.)
- **1 Free Action** (move to adjacent zone, draw weapon, short speech)
- **Instant Actions** (defend against attacks — doesn't count against your limit)
- **Supplemental Action** (do a second small thing at -1 to your primary roll)

> [!warning] SWADE Players Note
> **There is no Multi-Action Penalty because there are no multi-actions.** You get one real action. The FATE way to "do more" is to set up Aspects with Maneuvers that allies invoke later. Teamwork happens across turns, not within one turn.

### Movement

| Move | Cost | Penalty |
|------|------|---------|
| Adjacent zone | Free Action | None |
| Two zones (Hustle) | Supplemental Action | -2 to other action |
| Sprint (3+ zones) | Supplemental + Athletics test (Diff 2) | -3, each Shift = 1 more zone |

### Damage Calculation

```
Stress = Attack Shifts + Weapon Rating (WR) - Armor Rating (AR)
```

Absorb with stress boxes (left to right) or take a Consequence.

| Consequence | Absorbs | Recovery | Notes |
|-------------|---------|----------|-------|
| Mild | 2 | 1 hour (physical) / 1 day (mental) | Clears relatively fast |
| Moderate | 4 | 1 day / 1 week | |
| Severe | 6 | 1 week / 1 month | Becomes a Persistent Aspect |
| Extreme | 8 | Permanent | Replaces one of your character Aspects |

> [!warning] SWADE Players Note
> **There is no Soak roll.** You don't spend a Fate Point to reduce damage. Consequences absorb hits automatically — but they become negative Aspects that enemies invoke against you (first use free). This is the trade: you stay standing, but you're weakened narratively.

---

## Page 3: Aspects & Fate Points

### What Aspects Are

Short phrases that describe something true about a character, scene, or situation. They are the core engine of FATE — they replace most of what Edges, Hindrances, and situational modifiers did in SWADE.

**Every character has 5 Aspects:**
1. **High Concept** — who you are ("Disgraced Coalition Intelligence Analyst")
2. **Trouble** — your recurring problem ("Can't Leave Well Enough Done")
3. **Background** — where you came from
4. **State Aspect** — tied to Pure/SIM/Sleeved
5. **Free Aspect** — anything else important

### Using Aspects

| Action | Cost | Effect |
|--------|------|--------|
| **Invoke** | 1 FP | +2 to your roll OR reroll (must explain why the Aspect helps) |
| **Get Compelled** | Earn 1 FP | GM uses your Aspect to complicate your life — accept or pay 1 FP to refuse |
| **Free Invoke** | Free | First use of an Aspect you created via Maneuver, Spin, or inflicted Consequence |

**The "Therefore" Test:** "I have *[Aspect]*, **therefore** it helps me *[do this thing]*." If you need two logical leaps, it's a stretch.

### Scope Rule

You may invoke **one Aspect per scope** per roll:

| Scope | Example |
|-------|---------|
| Character Aspect | "Cryo-Survivor With Trust Issues" |
| Scene Aspect | "Flickering Emergency Lighting" |
| Zone Aspect | "Exposed Catwalk" |
| Equipment Aspect | "Military-Grade Coil Rifle" |
| Consequence (on target) | "Bleeding From the Shoulder" |

Persistent Aspects (P) are **exempt** from the scope limit.

### Fate Points

| Rule | Detail |
|------|--------|
| Start each session at **Refresh** | Default 5; Pure = 7; reduced by non-free Stunts |
| **Never carry over** | Use them or lose them |
| Spend to invoke | +2 or reroll, tied to a relevant Aspect |
| Spend to declare | Introduce a story fact ("There's a service tunnel here") |
| Earn from compels | GM complicates your life via your Aspects = +1 FP |
| Refuse a compel | Pay 1 FP to say "no, not this time" |

> [!warning] SWADE Players Note
> **Fate Points are not Bennies.** You can't spend them for a generic reroll — you must name an Aspect and explain the connection. This feels restrictive at first, but your Aspects are broad enough that you'll almost always find one that fits. The trick is writing Aspects that are useful in many situations.

### The Compel Loop

This is the engine SWADE doesn't have:

```
GM compels your Trouble → you accept → earn 1 FP →
  later, invoke an Aspect → spend 1 FP → get +2 →
    succeed with Spin → create free Effect Aspect →
      ally invokes it free → chain of narrative advantage
```

**Lean into compels.** They're not punishment — they're fuel.

---

## Page 4: Nova Praxis Specifics

### Character States

| State | Physical Skills | Refresh | Key Perk | Key Cost |
|-------|----------------|---------|----------|----------|
| **Pure** | 8 ranks (you assign) | +2 (= 7 base) | Carpe Diem stunt (free scene Aspect), +1 to one skill | Lose all benefits if you ever Apothesize |
| **SIM** | 7 ranks (virtual) | Standard (5) | +1 SINC, +1 S.Eng, choice stunt | No body — needs drones, suffers lag penalties |
| **Sleeved** | Set by sleeve | Standard (5) | Sleeve augmentations, swappable bodies | Resleeving = mental attack (Edge 8) |

### Three Stress Tracks

Unlike SWADE's single Wound track, FATE Nova Praxis has **three independent tracks:**

| Track | Filled By | Calculated From |
|-------|-----------|----------------|
| **Physical** | Combat, environmental damage | Athletics + Endurance |
| **Mental** | Fear, manipulation, resleeving trauma, Edge attacks | Cohesion + Resolve |
| **System** | Failed Savant programs, cyber attacks | SINC + S. Engineering (Savants only) |

### Rep-Rating & Assets

| SWADE Equivalent | FATE Mechanic |
|-----------------|---------------|
| Buying gear with credits | **Rep-Rating** test vs. Cost (Coalition space) |
| Black market purchases | **Assets** skill test vs. Cost |
| Failure = lost money | Failure = **Rep Hit** (reputation damage) |
| Restricted items need Edge | Restricted items need **Licensed** stunt or use Assets |

### Savant Programs (Replaces SWADE Powers)

| SWADE Concept | FATE Equivalent |
|---------------|----------------|
| Arcane Background | **Savant** stunt (unlocks SINC skill) |
| Power Points | None — roll SINC vs. Program Difficulty |
| Spell failure | Fail = **System Stress** (shifts missed by) |
| Backlash | **Stall** = catastrophic system failure |
| Power list | Savant Programs (each is a stunt to unlock) |

### Sleeves & Augmentations

- Sleeves set your Physical skill ranks and provide **Augmentation Points**
- More expensive sleeves = better physical stats + more augmentation capacity
- Starting sleeve Cost: MAX(Assets, Rep-Rating) + 4
- **Augmentation Limit** = Endurance rank x 2 (for AV-counted augmentations)
- Cyberware and bioware both exist — talk to the GM about options

### Quick Mindset Resets

| You want to... | In FATE, do this instead |
|---|---|
| Attack twice | Attack once, or Maneuver first → invoke the Aspect next turn |
| Soak damage with a Bennie | Take a Consequence (it becomes an invokable Aspect) |
| Roll Vigor to stay up | Absorb with stress + Consequences, or Concede |
| Roll Notice | Perception (senses) or Insight (gut/reading people) |
| Roll Spirit to resist | Resolve (willpower) or Cohesion (sense of self) |
| Aid an ally | Maneuver → place Aspect → ally invokes for +2 |
| Use an Edge for a bonus | Check Stunts, or invoke a relevant Aspect |

---

*Full migration guide: [[Campaign Overview/SWADE to FATE Migration Guide]]*
*Character creation: [[Campaign Overview/New Player Primer - Cold Start Syndicate]]*
*Rules reference: [[Rules and Mechanics/Rules Quick Reference - Unified]]*
