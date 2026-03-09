---
aliases:
  - pc overview
  - player overview
  - party overview
tags:
  - pc
  - dashboard
  - runtime
---

# PC Overview

Live reference for all player characters. Auto-updates from frontmatter.

---

## Party At a Glance

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  state as "State",
  house as "House",
  refresh as "Refresh",
  fate-points as "FP",
  rep-rating as "Rep"
FROM "Characters/Players"
WHERE contains(tags, "pc") AND contains(tags, "character")
SORT file.name ASC
```

---

## Player Map

| Player | Character | State | House |
|--------|-----------|-------|-------|
| Dan | [[Characters/Players/Aeddarius Crucial/Aeddarius Crucial - FATE Character\|Aeddarius Crucial]] | Pure | Dalianis |
| Christa | [[Characters/Players/Azaria Dawson/Azaria Dawson - FATE Character\|Azaria Dawson]] | Sleeved | Silva |
| Rob | [[Characters/Players/Dustin (Grift) Halloway/Dustin Halloway - FATE Character\|Dustin "Grift" Halloway]] | Sleeved | Kimura |
| Sara | [[Characters/Players/Grace Pryzbylski/Grace Pryzbylski - FATE Character\|Grace Pryzbylski]] | SIM | Kimura |
| James | [[Characters/Players/Kallius/Kallius - FATE Character\|Kallius]] | Sleeved | Kimura |
| Matt | [[Characters/Players/Dr. Lorem (Doc) Ipsum/Dr. Lorem Ipsum - FATE Character\|Dr. Lorem "Doc" Ipsum]] | Sleeved | Silva |

> **Doc Ipsum** (Matt) sheet is a SWADE conversion — Matt should verify in the character creator and export a canonical version.

---

## High Concepts

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  high-concept as "High Concept",
  skill-distribution as "Build"
FROM "Characters/Players"
WHERE contains(tags, "pc") AND contains(tags, "character")
SORT file.name ASC
```

---

## Aspects — ABCDE Framework

All characters use the **ABCDE Aspect Framework**:

| Slot | Type | Purpose |
|------|------|---------|
| **HC** | High Concept | Who you are in one phrase |
| **A** | Ambition | What drives you forward |
| **B** | Belief | What you hold true |
| **C** | Connection | Who or what anchors you |
| **D** | Disadvantage | What holds you back |
| **E** | Expertise | What you're best at |
| **S** | Savant Disadvantage | *(Savants only)* Negative side of hacking the mindset |

### Defined Aspects

| Character | HC | Ambition | Belief | Connection | Disadvantage | Expertise | Savant |
|-----------|-----|----------|--------|------------|--------------|-----------|--------|
| Aeddarius | Aesthetic Aristocrat | Ruthless Pragmatist in a Noble's Clothing | Purity Is Strength, Not Sentiment | Newly Minted Lord with Old Debts | The Habit Behind the Composure | Always Challenges the Strongest Foe | — |
| Azaria | *TBD* | Celebrity Status At Any Cost | *TBD* | *TBD* | *TBD* | *TBD* | — |
| Grift | Ghost in the System Seeks Identity | Truth Hunter in a World of Lies | Corporate Loyalty Is Programmed Slavery | Briar's Favors Always Come with Interest | Curiosity Kills More Than Cats | Digital Locks Are Just Suggestions | Craves Sensations My Digital Mind Can't Process |
| Grace | SIM Drone Jock Recluse | Shield My Few Friends From Everything | Always Observing, Never Observed | Kallius' Personal Ward | Thin Skinned and Trauma-Triggered | "Dance, Puppets!" — Neural Command Choreographer | Scopophobia |
| Doc | Synthesized Astronaut, Lord of the Swarm | Ascension Lies Between Flesh and Synthetics | A Gentleman's Word Is Absolute, God Is Not | Scion of Silva's Inner Circle | Fire Still Burns Behind My Eyes | One with the Swarm — Millions Move as One | Evolved Beyond the Baseline |
| Kallius | Black Market Memory Merchant | Perfect Neural Resurrection Through Data Mastery | The Past Is Currency, I'm the Bank | My Pure Self Still Calls | I Know a Truth the Coalition Would Kill to Bury | Mnemonic Savant, Memory Palace Architect | Virtual or Not, Reality Is the Same to Me |

> **Azaria** has 4 undefined aspects — Christa should finalize before Session 10.
> **Aeddarius** and **Doc** aspects are GM proposals from session evidence — Dan and Matt have final approval.

---

## Stress Tracks

```dataview
TABLE WITHOUT ID
  file.link as "Character",
  physical-stress as "Physical",
  mental-stress as "Mental",
  system-stress as "System"
FROM "Characters/Players"
WHERE contains(tags, "pc") AND contains(tags, "character")
SORT file.name ASC
```

---

## Active Consequences

```dataview
LIST consequences
FROM "Characters/Players"
WHERE contains(tags, "pc") AND contains(tags, "character") AND consequences != null
SORT file.name ASC
```

---

## Party Roles

| Role | Primary | Secondary |
|------|---------|-----------|
| **Strategic Commander** | Aeddarius | Kallius |
| **Social Face** | Azaria | Aeddarius |
| **Combat (Direct)** | Doc (Esper Swarm) | Aeddarius (Ludwig) |
| **Combat (Drone)** | Grace | Aeddarius (Ludwig) |
| **Combat (Ranged)** | Doc (Firearms +4) | Kallius (Firearms +3) |
| **Hacking / Intrusion** | Grift | Grace |
| **Mnemonic Ops** | Kallius | Grift |
| **Engineering** | Grace (Hardware) | Doc (Software +4) |
| **Pilot** | Doc (+4) | Kallius (+2) |
| **Surveillance / Recon** | Grace | Aeddarius (Perception +4) |
| **Investigation** | Grift | Kallius |

---

## Savant Status

| Character | Savant? | SINC | Programs |
|-----------|---------|------|----------|
| Aeddarius | No | — | — |
| Azaria | No | — | — |
| Doc | Yes | +3 | Esper Lord |
| Grift | Yes | +3 | System Invasion, Pattern Scan |
| Grace | Yes | +4 | Puppeteer |
| Kallius | Yes | +4 | Memory Hack (+2), Access Memory |

---

## Quick Links

| Character | Sheet | Interlude |
|-----------|-------|-----------|
| Aeddarius Crucial | [[Characters/Players/Aeddarius Crucial/Aeddarius Crucial - FATE Character\|Sheet]] | — |
| Azaria Dawson | [[Characters/Players/Azaria Dawson/Azaria Dawson - FATE Character\|Sheet]] | [[Characters/Players/Azaria Dawson/Interlude\|Interlude]] |
| Dr. Lorem "Doc" Ipsum | [[Characters/Players/Dr. Lorem (Doc) Ipsum/Dr. Lorem Ipsum - FATE Character\|Sheet]] | [[Characters/Players/Dr. Lorem (Doc) Ipsum/Interlude\|Interlude]] |
| Dustin "Grift" Halloway | [[Characters/Players/Dustin (Grift) Halloway/Dustin Halloway - FATE Character\|Sheet]] | [[Characters/Players/Dustin (Grift) Halloway/Interlude\|Interlude]] |
| Grace Pryzbylski | [[Characters/Players/Grace Pryzbylski/Grace Pryzbylski - FATE Character\|Sheet]] | — |
| Kallius | [[Characters/Players/Kallius/Kallius - FATE Character\|Sheet]] | [[Characters/Players/Kallius/Interlude\|Interlude]] |

---

## Milestones

| Character | Next Milestone |
|-----------|---------------|
| Aeddarius | Minor |
| Azaria | Minor |
| Doc | Minor |
| Grift | Minor |
| Grace | Minor |
| Kallius | Major |

---

#ttrpg #nova-praxis #pc #dashboard
