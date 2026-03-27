# Savage Worlds to FATE Transition Guide

A practical guide for helping players transition from Savage Worlds (SWADE) to FATE — specifically [[_Assets/Extracts/Nova Praxis Rulebook (Cleaned).txt|Nova Praxis]].

---

## The Big Picture

Savage Worlds and FATE are both narrative-leaning systems, but they solve problems differently. SWADE gives you a tactical toolkit and says "build your character from parts." FATE gives you a story engine and says "tell me who your character *is*." The transition isn't about learning harder rules — it's about unlearning the reflex to look for the right stat and instead asking "what makes this moment interesting?"

---

## Core Mechanic Comparison

| Concept | Savage Worlds | FATE (Nova Praxis) |
|---------|--------------|-------------------|
| **Dice** | Trait die + Wild Die (exploding) | 4 Fudge dice (4dF), range -4 to +4 |
| **Resolution** | Roll ≥ Target Number (usually 4) | Roll + Skill ≥ Difficulty, difference = **Shifts** |
| **Critical Success** | Raise (every 4 over TN) | **Spin** (3+ Shifts) — create an Effect Aspect |
| **Critical Failure** | Snake Eyes / Critical Failure | **Stall** (fail by 3+) — spectacular failure |
| **Currency** | Bennies | [[Glossary/Fate Points\|Fate Points]] |
| **Damage** | Damage roll vs. Toughness | Stress = Shifts + Weapon Rating − Armor Rating |

### What to Tell Players

> "You're not rolling to see *if* you succeed — you're rolling to see *how well* and *at what cost*. The dice range is smaller, but you have way more levers to pull through Aspects and Fate Points."

---

## Aspects Replace (Almost) Everything

This is the hardest shift. In SWADE, your character is defined by Attributes, Edges, Hindrances, and gear stats. In FATE, **Aspects** do most of that work — but they're double-edged and narrative rather than mechanical.

### The SWADE-to-Aspect Translation

| SWADE Element | FATE Equivalent | Example |
|---------------|----------------|---------|
| **Hindrances** | Character Aspects (compel side) | *Overconfident* Hindrance → **Overconfident: Believes She Can Do Anything** |
| **Edges** (narrative) | Character Aspects (invoke side) | *Charismatic* Edge → baked into an Aspect like **Master of Disguise and Deception** |
| **Edges** (mechanical) | [[Rules and Mechanics/Stunts\|Stunts]] | *Level Headed* → a custom Stunt |
| **Attributes** | Folded into Skills or implied by Aspects | Vigor → [[Rules and Mechanics/Skills#Endurance\|Endurance]] skill; Spirit → [[Rules and Mechanics/Skills#Cohesion\|Cohesion]] / [[Rules and Mechanics/Skills#Resolve\|Resolve]] |
| **Derived Stats** | Stress Tracks (Physical, Mental, System) | Toughness → Physical Stress Track |

### Key Teaching Moment: Aspects Are Not Hindrances

In SWADE, Hindrances give you build points and the GM occasionally invokes them. In FATE, your "flaws" are **the same Aspects as your strengths** — they're always in play, and accepting a compel earns you Fate Points you'll spend later to be awesome. The economy is circular:

```
Compel accepted → gain FP → Invoke later → spend FP → be awesome → GM compels again
```

**Exercise for players:** Have each player take one of their old Hindrances and one Edge, then write a single Aspect sentence that captures *both*. That's the FATE mindset.

---

## Bennies vs. Fate Points

Players will instinctively treat Fate Points like Bennies. They're similar but different in crucial ways:

| Feature | Bennies (SWADE) | Fate Points (FATE) |
|---------|----------------|-------------------|
| **Starting Pool** | 3 per session | [[Rules and Mechanics/Character States#Refresh\|Refresh Rating]] (default 5) |
| **Earning** | GM award, Joker, Hindrance triggers | Accepting compels on Aspects |
| **Spending** | Reroll, Soak, remove Shaken | Invoke (+2 or reroll), Block, Declaration |
| **Carry Over** | Yes (up to session start amount) | **No** — reset to Refresh each session |
| **Frequency** | Fewer, more precious | More fluid, meant to circulate |

### What to Tell Players

> "Fate Points aren't a safety net you hoard — they're fuel. The more trouble you let your Aspects cause, the more fuel you have for the moments that matter. If you end a session with a full stack, you left power on the table."

---

## Skills: Simpler but Different

SWADE has 5 Attributes and ~30 Skills tied to them. Nova Praxis has **no Attributes** — just a flat skill list ranked on the [[Rules and Mechanics/Character States#FATE Ladder|FATE Ladder]] (+0 to +5).

### Notable Mappings

| SWADE Skill/Attribute | Nova Praxis Skill | Notes |
|----------------------|------------------|-------|
| Fighting | [[Rules and Mechanics/Skills#Melee\|Melee]] | Covers unarmed and melee weapons |
| Shooting | [[Rules and Mechanics/Skills#Firearms\|Firearms]] | Railguns, coil guns, PAc weapons |
| Persuasion | [[Rules and Mechanics/Skills#Diplomacy\|Diplomacy]] | Friendly persuasion |
| Intimidation | [[Rules and Mechanics/Skills#Intimidation\|Intimidation]] | Unchanged |
| Stealth | [[Rules and Mechanics/Skills#Stealth\|Stealth]] | Also covers pickpocketing |
| Notice | [[Rules and Mechanics/Skills#Perception\|Perception]] | Now a **Physical Skill** (tied to sleeve) |
| Spirit | [[Rules and Mechanics/Skills#Resolve\|Resolve]] + [[Rules and Mechanics/Skills#Cohesion\|Cohesion]] | Split into willpower and identity stability |
| Vigor | [[Rules and Mechanics/Skills#Endurance\|Endurance]] | Physical Skill — determined by sleeve for Sleeved characters |
| Hacking | [[Rules and Mechanics/Skills#SINC\|SINC]] | Savant-only, replaces all hacking |
| Repair | [[Rules and Mechanics/Skills#Engineering, Hardware\|H.Eng]] / [[Rules and Mechanics/Skills#Engineering, Software\|S.Eng]] | Split into hardware and software |
| Networking | [[Rules and Mechanics/Skills#Networking, House\|H.Net]] / [[Rules and Mechanics/Skills#Networking, Apostate\|A.Net]] | Split by faction allegiance |

### The Physical Skill Gotcha

In SWADE, your physical stats are yours. In Nova Praxis, **Physical Skills (Athletics, Endurance, Perception) are determined by your sleeve** — not your ego. If you resleeve, your physical capabilities change. Only [[Rules and Mechanics/Character States#Pure|Pure]] characters set their own physical skills.

> "Think of it this way — your mind remembers how to fight, but your new body might not be as fast. Your Firearms skill stays the same, but your Athletics might drop if you sleeve into a cheaper body."

---

## Combat: Zones, Not Squares

This is usually the smoothest transition because SWADE players already think tactically.

### Key Differences

| SWADE | FATE (Nova Praxis) |
|-------|-------------------|
| Grid/inches for range | **Zones** — abstract areas (a room, a rooftop, a corridor) |
| Initiative: Deal cards | Initiative: [[Rules and Mechanics/Skills#Strategy\|Strategy]] or [[Rules and Mechanics/Skills#Insight\|Insight]] skill |
| Actions: Multi-action penalty | Actions: 1 Simple Action + 1 Free Action per round |
| Damage: Roll damage vs. Toughness | Stress: Shifts + WR − AR applied directly |
| Wounds (3 + Incapacitated) | [[Rules and Mechanics/Gameplay#Consequences\|Consequences]]: Mild (−2), Moderate (−4), Severe (−6), Extreme (−8) |
| Shaken → Wound escalation | Stress boxes fill → take Consequences or be **Taken Out** |
| Soak rolls (spend Bennie) | Concessions (narrative exit, not mechanical soak) |

### What to Tell Players

> "Forget counting squares. A zone is whatever makes sense — 'the bridge,' 'the engine room,' 'behind the cargo containers.' Moving to an adjacent zone is free. If you want to sprint across multiple zones, that costs you accuracy on your attack."

### Maneuvers: The New Action Economy

SWADE players will try to attack every round. Teach them that in FATE, **Maneuvers** (placing Aspects on targets or scenes) are often more powerful than attacks:

> "In Savage Worlds, the best move is usually 'shoot them.' In FATE, spending a round to put **Pinned Down** on an enemy gives your whole team a free +2 on their next attack against that target. Setting up the kill shot is as important as taking it."

---

## Consequences Replace Wound Tracking

SWADE's wound system is binary: you take wounds, you Soak or you don't. FATE's [[Rules and Mechanics/Gameplay#Consequences|Consequence]] system is **narrative** — each consequence is a new Aspect.

| SWADE | FATE |
|-------|------|
| Wound 1, 2, 3 | Mild (−2), Moderate (−4), Severe (−6) |
| Incapacitated | Extreme (−8) or **Taken Out** |
| Healing roll after X time | Consequences **downgrade** over time (Severe → Moderate → Mild → gone) |

### The Narrative Hook

When a player takes a Moderate Consequence, they don't just mark a box — they name it. **Cracked Ribs**, **Shattered Confidence**, **Bleeding Out**. That Consequence is now an Aspect the enemy can invoke against them. This makes injuries *matter* in the fiction, not just on the sheet.

> "Your wounds tell a story now. A Severe Consequence of **Arm Crushed by Bulkhead** doesn't just give you a penalty — it changes how every scene plays until it heals. And the GM can compel it."

---

## Resleeving: What SWADE Didn't Have

The biggest mechanical addition in Nova Praxis FATE is the [[Rules and Mechanics/Character States|State system]] and resleeving. Make sure players understand:

- **Pure** characters are in their birth body — more Fate Points (Refresh +2), the [[Rules and Mechanics/Stunts#Carpe Diem|Carpe Diem]] stunt, but they can't resleeve
- **Sleeved** characters have undergone [[Glossary/Apotheosis]] — they can swap bodies, but their Physical Skills change with their sleeve
- **SIM** characters exist as pure software — they interact through drones and meshes, with lag penalties over distance

> "In Savage Worlds, your character sheet was fixed. In Nova Praxis, half your sheet might change if you die and come back in a different body. Your ego — your skills, Aspects, and personality — persists. Your body is hardware."

---

## Session Zero Conversion Checklist

For players rebuilding their characters from SWADE to FATE:

### Step 1: Write Aspects First
- [ ] Take your old Hindrances — rewrite each as a double-edged Aspect
- [ ] Take your character concept — distill it into a **High Concept** Aspect
- [ ] What gets your character in trouble? That's your **Trouble** Aspect
- [ ] Add 2-3 more Aspects from backstory, relationships, or signature traits
- [ ] Add Sleeve Aspects if Sleeved (physical traits of the body)

### Step 2: Pick a State
- [ ] Were you Pure in SWADE? Stay [[Rules and Mechanics/Character States#Pure|Pure]] for more Fate Points and narrative freedom
- [ ] Want tactical flexibility and body-swapping? Go [[Rules and Mechanics/Character States#Sleeved|Sleeved]]
- [ ] Want to be a digital ghost running drones? Go [[Rules and Mechanics/Character States#SIM|SIM]]

### Step 3: Choose a Skill Distribution
- [ ] **Specialist:** 1 at +5, 2 at +4, 2 at +3, 3 at +2, 6 at +1 (14 skills — focused)
- [ ] **Expert:** 3 at +4, 3 at +3, 4 at +2, 6 at +1 (16 skills — well-rounded)
- [ ] **Generalist:** 7 at +3, 8 at +2, 3 at +1 (18 skills — broad)

### Step 4: Map Old Edges to Stunts
- [ ] Check the [[Rules and Mechanics/Stunts|Stunts list]] for equivalents
- [ ] Remember: some old Edges are now covered by Aspects instead
- [ ] State-specific stunts are free (Carpe Diem for Pure, SIM State for SIM, etc.)

### Step 5: Talk About the Economy
- [ ] Explain: Fate Points **do not carry over** between sessions
- [ ] Explain: Compels are **opportunities**, not punishments
- [ ] Explain: Invoking Aspects is how you control the narrative, not just boost dice
- [ ] Practice: Run a mock conflict so players feel the Invoke/Compel loop

---

## Common Player Concerns

### "I feel less powerful without my Edges"
Edges gave static bonuses. Aspects + Fate Points give you **situational** power that's often stronger — a +2 from invoking an Aspect stacks with other Aspect invocations across different scopes (character, scene, equipment). You can stack more bonuses in FATE than you ever could in SWADE, but you have to earn them through the fiction.

### "Combat feels less crunchy"
It is — on purpose. FATE combat resolves faster and emphasizes *dramatic stakes* over *tactical optimization*. If players miss the crunch, lean into zone design, environmental Aspects, and Maneuver play. Make the battlefield interesting and they'll find plenty of decisions to make.

### "I don't know when to use Fate Points"
Common early pattern: players hoard FP like Bennies. Break this by compelling early and often in the first few sessions. Once they see the loop — accept compels, gain FP, spend FP for big moments — the rhythm clicks.

### "What happened to my stats?"
There are no Attributes. Your Vigor is now [[Rules and Mechanics/Skills#Endurance|Endurance]], your Spirit is split between [[Rules and Mechanics/Skills#Resolve|Resolve]] and [[Rules and Mechanics/Skills#Cohesion|Cohesion]], and your Smarts is folded into relevant skills like [[Rules and Mechanics/Skills#Education|Education]], [[Rules and Mechanics/Skills#Insight|Insight]], and [[Rules and Mechanics/Skills#Research|Research]]. It feels weird for one session, then it doesn't matter.

### "What about Bennies for Soaking?"
There is no Soak roll. Instead, you absorb hits by taking [[Rules and Mechanics/Gameplay#Consequences|Consequences]] — named injuries that become Aspects. You can also **Concede** a conflict to exit on your own terms before being Taken Out. Conceding isn't losing; it's losing *gracefully*.

---

## GM Tips for the Transition

1. **Compel aggressively in early sessions.** Players need to see FP flowing before they'll spend them freely. Aim for 2-3 compels per player per session until they internalize the economy.

2. **Use Persistent Aspects liberally.** They're free to invoke/compel for +2/reroll and give scenes immediate texture. SWADE players will appreciate having environmental factors they can interact with.

3. **Narrate Consequences.** When a player takes a Consequence, don't just say "mark Moderate." Ask them what it looks like. This is where FATE shines and where SWADE players will start to *get it*.

4. **Keep early combats short.** 2-3 rounds. Let players feel the system without getting bogged down in rules lookups. Complexity comes from Aspect play, not from stat blocks.

5. **Celebrate Maneuvers.** When a player places an Aspect instead of attacking, make it matter. Show them the payoff when their teammate invokes it for a devastating hit.

6. **Reference the old characters.** Your players already have SWADE sheets in the [[Archive/SWADE Character Sheets|archive]]. Use those as springboards — "Your old Overconfident Hindrance? That's now an Aspect that earns you Fate Points when it gets you in trouble *and* gives you +2 when your sheer audacity should carry the day."

---

**Tags:** #reference #mechanics #transition #guide #savage-worlds #fate
