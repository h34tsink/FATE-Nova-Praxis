---
tags:
  - type/session
  - type/scene
  - type/gm-runtime
session: 9
scene: 2
aliases:
  - "Scene 02 - Echoes in the Noise"
  - "Echoes in the Noise"
---

# Scene 02 — Echoes in the Noise

**Location:** Cere Mining Colony interior — tavern, markets, relay infrastructure, and abandoned mining tunnels

**Purpose:** Investigation under pressure. Can the PCs find [[Character Profile|Valare]]'s fork without exposing her to predators?

---

## Zones

| Zone | Aspects |
|------|---------|
| **[[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Deepshaft Tavern\|Deepshaft Tavern]]** | *Everyone's Listening* · *Cheap Drinks, Expensive Answers* |
| **[[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Core Markets\|Core Markets]]** | *Information Has a Price* · *Too Many Eyes for a Quiet Conversation* |
| **[[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Shadow Relay Node\|Shadow Relay Node]]** | *Old Signals, New Enemies* · *Someone Else Is Already Scraping These Logs* |
| **[[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Abandoned Mining Access\|Abandoned Mining Access]]** | *The Rock Remembers* · *Unstable Footing, No Witnesses* |

---

## Scene Aspects

- *The Clock Is Already Ticking* — factions are converging; every loud move narrows the window
- **[GM only]** *Valare's Savant Programs Monitor Digital Searches* — sloppy queries using her name or sleeve description alert her immediately

---

## NPCs Present

| NPC | Token | Role in Scene | Opening Stance |
|-----|-------|--------------|----------------|
| [[GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact)\|Kal Paddock]] | `kal` | Docking fixer turned lead broker; knows tunnel routes | Transactional — will share if paid and kept quiet |
| [[GM AI/Entity Cards/R3/Seren (R3 Important Contact)\|Seren]] | `seren` | Talon-network contact; can provide constrained leads | Loyalty-gated — demands proof of non-coercion intent |
| [[GM AI/Entity Cards/R2/Mira Okafor (R2 Core Markets Vendor)\|Mira Okafor]] | `mira` | Core Markets vendor; sold Valare supplies | Nervous — will talk if she feels safe doing so |
| Shadow Market runner (unnamed) | — | Competitive searcher; also hunting Valare | Suspicious, opportunistic, will trade or race |

### NPC Introduction Hooks

Each NPC has a specific **trigger** for entering the conversation and a **motivation** for engaging. See individual zone files for full read-aloud introductions. Quick reference:

| NPC | Trigger Type | Why They Engage | Where |
|-----|-------------|----------------|-------|
| **Kal Paddock** | Interruption — PCs are about to make a mistake on his turf | Protecting his business from heat | [[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Deepshaft Tavern\|Deepshaft Tavern]] |
| **Seren** | Third-party referral — someone points PCs to her | Assessing whether PCs are worth the risk | [[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Deepshaft Tavern\|Deepshaft Tavern]] |
| **Mira Okafor** | Reaction — PCs investigate the right stall and she freezes | Fear of consequences; she knows she helped a fugitive | [[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Core Markets\|Core Markets]] |
| **Shadow Market runner** | Transaction — she wants something the PCs have | Competing for the same target; willing to trade or race | [[Sessions/Session 9/Scenes/Scene 02 - Echoes in the Noise/Core Markets\|Core Markets]] |

---

## Read or Paraphrase — Opening

> You're inside Cere now. The colony interior is a cramped lattice of rock-cut corridors, repurposed mining shafts, and habitat pods strung together with cable and hope. The air tastes metallic and recycled. Lighting flickers between industrial yellow and nothing. People move with purpose — miners, fixers, dock runners, the occasional face that doesn't belong. Somewhere in this warren, a woman is hiding because she's terrified of becoming someone else. You need to find her before the people who don't care about her fear do. The question is how loud you're willing to be about it.

---

## Clues Available

Each successful investigation beat yields **one** piece of the three-part intel picture: **location**, **sleeve description**, or **contact name**.

| Zone | Clue | Method | Risk |
|------|------|--------|------|
| **Deepshaft Tavern** | Someone saw a woman matching Valare's sleeve buying a cheap air canister and burner comm | Social (Contacts, Rapport) with locals or Kal | Talon sympathizer tests PCs: *"Are you here to save her, or own her?"* |
| **Core Markets** | Vendor sold Valare a privacy tarp and mnemonic dampener patch | Resources or Investigate with [[GM AI/Entity Cards/R2/Mira Okafor (R2 Core Markets Vendor)\|Mira]] | [[Locations/Shadow Market]] runner offers info for a favor that will come due later |
| **Shadow Relay Node** | Burst transmission from Valare: *"I won't merge. Don't make me."* (timestamped, partial routing) | SINC / Investigate (digital) | Logs are already being scraped — rival faction is here; tick Exposure |
| **Abandoned Mining Access** | Fresh handprints, heat residue, dropped med injector (from Valare) | Notice / Investigate (physical) | Environmental hazards or territorial scavengers force speed-vs-care choice |

### Roll Outcomes

| Result | What They Get |
|--------|---------------|
| Clean success | 1 clue (location, sleeve description, or contact name) |
| Success with cost | 2 clues + tick Exposure OR owe a favor |
| Failure | False or stale lead + tick Exposure |
| Going loud | Immediate Exposure tick + show who noticed |

---

## Beats

### Beat 2.1 — The Room Leans In

**Trigger:** PCs ask their first obvious question about Valare.

Someone registers recognition — a pause, a glance, a hand drifting to a comlink. This is atmosphere, not a roll. Let the reaction guide whether difficulty checks happen next.

**Compel offer:** *"You feel eyes on you."*

**Savant note:** If the question goes through data systems or comms, Valare's programs may flag it. Sloppy = immediate detection. Careful = delayed.

---

### Beat 2.2 — First Clue / First Cost

**Trigger:** PCs make a successful Investigate, Resources, or Contacts roll.

They get one solid piece of intel from the clue table above. If they roll exceptionally well, give two — but attach a cost (favor owed, reputation marker like *Asking About Valare*, or time spent that ticks Exposure).

---

### Beat 2.3 — Pressure from a Rival Team

**Trigger:** Exposure at 1+, or PCs took obvious action (comms to known contacts, public scene, sloppy data searches).

Pick one or more:
- A tail appears — someone following at distance, or a contact reports being asked about the PCs
- A faction face (Talons, [[Factions/The Coalition/_Coalition Overview|Coalition]], [[Locations/Shadow Market]]) appears in the same zone
- A message arrives: *"You're asking the wrong people. Back off."*
- Valare's programs detect the investigation; she sends a warning burst: *"Stop looking. You don't understand what you're doing."*

**This is pressure, not a fight** — unless PCs escalate. Offer exits: leave zone (tail fades, but they know they're compromised), confront/negotiate (risks Exposure on loud failure), or hide/fake out (moderate difficulty, creates aspect *Under the Radar*).

---

### Beat 2.4 — False Lead or Sidetrack

**Trigger:** A failed roll, or PCs follow a less-direct source.

Intel that's plausible but wrong — or true but stale (she *was* here, she's moved). Costs time (tick Exposure) or wastes a favor.

**Savant layer:** Valare may have intentionally fed false info through her programs if she's aware of the pursuit. This can be revealed later as a test.

**Key:** Tie the false lead to the *next* real clue — the dead end contains a trace of where she actually went.

---

### Beat 2.5 — Escalation Decision Point

**Trigger:** After 2–3 information-gathering beats, or Exposure approaching 2.

Frame the choice with weight:

> *"You have a solid lead. Pushing now gets you to her in the next six hours — but you've been loud. Do you move now, or spend the night cooling off?"*

- **Push now:** Faster, but Exposure ticks. Offer a Fate Point for choosing the riskier move.
- **Cool off:** Spend time dampening noise, gathering resources, calling in favors. Slower, but Exposure holds or drops.

---

## Suggested Compels

- *Everyone's Listening* (Deepshaft Tavern) → Someone overhears the wrong question and sells it to a competing searcher
- *Information Has a Price* (Core Markets) → The vendor who helped Valare wants payment in kind — not credits, a task
- *Curiosity Kills More Than Cats* (Grift) → A data thread is *right there* in the relay node, but pulling it triggers a cascade of flags
- *Celebrity Status At Any Cost* (Azaria) → Someone recognizes her; now the crew's presence is public knowledge
- *The Habit Behind the Composure* (Aeddarius) → He pushes a contact too hard, revealing more urgency than he intended
- *Thin Skinned and Trauma-Triggered* (Grace) → The Talon sympathizer's accusation — *"Are you here to save her, or own her?"* — hits too close

---

## Exposure Clock Triggers (Scene-Specific)

Tick on any of:
- Failed investigation roll in a public zone
- Loud confrontation in any zone
- Digital query using Valare's name or sleeve description
- Spending more than one "shift" in the same zone
- Coercing an NPC who then reports the PCs

---

## Transition Hooks

- **Clean exit (Exposure 0–1):** PCs have solid intel, cover intact. They move toward the safehouse with initiative. → *"You have enough to move. Staying helps your cover; moving keeps initiative. Which risk do you take?"*
- **Noisy exit (Exposure 2):** PCs have intel but rivals are closing. Urgency rises. → *"You know where she is — but so does at least one other team. It's a race now."*
- **Hot exit (Exposure 3+):** Agents are actively moving. Valare may already be running. → *"Your window is closing. If you don't move now, someone else reaches her first."*

---

## Opening Line to the Table

> *"You're inside Cere. The air is bad, the lighting is worse, and somewhere in this rock someone is hiding because she's afraid of what you want from her. How do you start looking — and how careful are you about it?"*

<!-- conni: scene 02 echoes in the noise -->
