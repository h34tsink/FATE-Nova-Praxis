
---

status: reference
audience: gm
ruleset: nova-praxis-fate
---

# GM One-Pager: **Mimir Data-Cache Heist**
*Threads the engineering logs into play, with attunement tests & signature breadcrumbs.*

## Scene Frame
A buried **Mimir Cache** under a derelict transit spire. HPA drones sweep the exterior grid every 9 minutes. Inside: a cold room of humming racks and a nanite fab bay (powered but locked).

### Goals
1. Extract **Blueprint Fragments** and **Replicator Recipes** from the cache logs.
2. Identify **Signature Breadcrumbs** that point to an active Praetorian trace.
3. Perform a **Field Attunement** on one artifact using the extracted data.

---

## Mechanics (Fate Core)

### Challenge Structure (3 tracks)

- **Decrypt Logs** (Create Advantage / Overcome): **Great (+4)** base. Skills: **S.Eng, Research/Education, Cohesion**.  
  - Success: place *Recovered Fragment* (1 free invoke).  
  - Style: 2 free invokes **or** reduce HPA Attention by 1 tick.
- **Stabilize Fab Bay** (Overcome): **Great (+4)**. Skills: **H.Eng, S.Eng, Cohesion, Resolve**.  
  - Success: unlocks **Replicator Assist** (+2 to one Attunement roll this scene).  
- **Evade Sweep** (Defend/Create Advantage): Opposed by **HPA Sweep +4**. Skills: **Stealth, Guile, Cohesion (signature damp)**.  
  - Failure: tick **HPA Attention Clock** +1; at 6 → **Praetorian arrival**.

### Using the Logs (the JSONL file)

When a PC cites a **matching trio** from the logs—`blueprint_id`, `template_name`, `replicator_recipe.version`—grant **+2** on one related roll (decrypt, stabilize, or attune).  
Let players actually **search** the file (out of character) to “find” combos.

> Example combo: `BP-a19f3b, Conduit-Staff-III, R3.4` → +2 to **Stabilize Fab Bay** for discharge effects.

---

## Field Attunement (downtime, compressed)

- **Test**: **Great (+4)** vs **Tier +2** (e.g., Tier II = +4). Skill: **Cohesion or Resolve**.  
- **Boosts**: Each *Recovered Fragment* invoke used on the test adds **+2**. **Replicator Assist** adds **+2** once.  
- **On Success**: Attuned. Choose **one Boon** (GM-approved) tied to the template.  
- **On Tie**: Attuned but unstable: mark **Stability** 1 box.  
- **On Fail**: Gain **mild Feedback Consequence**; try again next session.

---

## Signature Breadcrumbs (trace game)
As PCs use Pneuma or query the cache, they leave **Signatures**. PCs can also **harvest** prior signatures from the logs.

- **Harvest**: **Create Advantage (S.Eng or Cohesion)** against **Good (+3)**. On success, place *Signature Breadcrumb [sig=XXXX:YYYY]*.  
- **Spend**: A breadcrumb gives **+2** to **avoid** a trace this scene **or** **-2** to HPA’s next **Create Advantage** to locate you.  
- **Set**: If the PCs plant 3 breadcrumbs with the **same sig** in different zones, the next HPA trace **misroutes** (lose 2 ticks of Attention).

> Flavor: Breadcrumbs are *intentional artifacts* in the log topology—little choruses of “wrong data” that lead hunters sideways.

---

## Rewards
- **Blueprint Fragment**: 1 invoke; spend to auto-succeed a **minor** (PL2) Pneuma use, or bank toward **Attunement**.  
- **Replicator Recipe**: reduce **materials cost**/time in downtime projects (GM sets magnitude).  
- **Void-Dust Cache**: one-use asset granting **+2 Potency Ceiling** for a single scene (still Overchannel-prone).

---

## Escalation Clocks
- **Instability (Scene)** 0/4 → weird local effects on 4; reset after scene.  
- **HPA Attention (Campaign)** +1 per public use/witness; on 3 tailing drones, on 6 raid/Praetorian.

---

## Table Tips
- Let the players **touch the file**. Reward concrete references: blueprint IDs, recipe versions, swarm IDs.  
- Offer **Cohesion** as the “make it hold together” button. Resolve = brace. S.Eng = syntax. Cohesion = *keep the lie polite*.
