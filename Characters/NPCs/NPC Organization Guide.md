---
tags:
  - reference
  - NPCs
  - fate
  - game-master
---

# NPC Organization Guide

This vault organizes NPCs by complexity and campaign importance:


## Generic NPCs (Mooks)
**Location:** `Characters/NPCs/Generic NPCs/`

These are template-style characters designed for quick use in encounters. They have:
- Basic stats and **[[Aspect]]s**
- Simple **[[Stunt]]s** and gear
- Intended for multiple uses (guards, thugs, common enemies)
- Easy to scale up or down for different encounters

**Examples:**
- [[Apostate Street Tough]]
- [[Apostate Worker]]
- [[Cyber-Merc]]
- [[Security Guard]]
- [[Lighthouse Heavy]]
- [[Lighthouse Security Operative]]
- [[Lighthouse Officer]]
- [[Red Sun Enforcer]]
- [[Talon of Freedom Soldier]]
- [[Talon of Freedom Officer]]


## Named NPCs (Major Characters)
**Location:** `Characters/NPCs/Named NPCs/`

These are unique individuals with:
- Full character development and backgrounds
- Complex motivations and relationships
- Detailed stat blocks with multiple **[[Aspect]]s**
- Campaign-significant roles
- Story hooks and adventure seeds

**Patrons & Contacts:**
- [[Gabriel Adams]] — Casino manager, transhumanist patron/antagonist (House Silva)
- [[Catalyst]] — Enigmatic Cipriani representative, hires Auxiliaries
- [[Kestrel]] — Fixer and apostate information broker (House Kimura)
- [[Isabella Nowak]] — Desperate House Tsarya executive
- [[Horizon]] — Phalanx Formation handler (House Silva / Oversight)
- [[Wei Tsou]] — House Jinzhan patron for the Enceladus mission
- [[Lian Sung]] — House Jinzhan logistics coordinator
- [[Concetta Allegro]] — House Cipriani intel operative
- [[Salvadore Bendry]] — Second Chances mnemonics engineer

**Antagonists & Threats:**
- [[Chimera]] — Major campaign villain, gestalt ego entity
- [[General Stanislaw Markov]] — House Tsarya traitor, campaign-arc antagonist
- [[Traeger]] — "The Viking," Knight of House Dalianis, celebrity warrior
- [[Greyton]] — Legendary ancient assassin (Apostate)
- [[Aaron Blackburn]] — True leader of the Talons of Freedom under deep cover
- [[Dr. Javier Schulz]] — Creator of the Progenesis virus (House Silva)
- [[Dr. Haruto Nakamura]] — Illegal ego-merging researcher, Chimera's creator
- [[Rusila Alvid]] — Pirate leader operating from New Turin

**Supporting Cast:**
- [[Rin Sakamoto]] — Pacifist biologist, antiphage discoverer (House Kimura)
- [[Lester Lucas]] — Smuggler, captain of The Chickenhawk (House Silva)
- [[Castor]] — The Viking's partner and handler (House Dalianis)
- [[Mogi]] — House Jinzhan informant, murdered by the Viking
- [[Geist]] — Seraphim field agent on Sanctuary
- [[Admiral Drivas]] — Tetragon admiral, Scholae Palatinae commander
- [[Tejun]] — SIM advisor to the Scholae (House Kimura)
- [[Malachite]] — Grigori crew, Tsarya manipulator in the Scholae
- [[Camber Roche]] — Mayor of Gondolin apostate enclave
- [[Tarj McClaren]] — Centurion pressuring apostates on Asola

**Ebon Jackal Crew** *(see [[The Ebon Jackal Crew]])*:
- [[Jace Welder]] — Captain and pilot
- [[Durian Konrad]] — Political operative (House Silva)
- [[Xavier Wilhelm]] — Idealist warrior (House Cipriani)
- [[Tiver Andlat]] — Criminal savant hacker (House Kimura)
- [[Christov Draiku]] — SIM chef/programmer (House Tsarya)


## Crew Groups
**Location:** `Characters/NPCs/`

Pre-designed groups of NPCs that work together, providing:
- **Ready-made relationships** and group dynamics
- **Factional diversity** and built-in conflicts
- **Balanced skill coverage** for various scenarios
- **Story hooks** through inter-character tensions

**Examples:**
- [[The Ebon Jackal Crew]] - Diverse salvage crew with hidden agendas


## Drones & Creatures
**Location:** `Characters/NPCs/Drones and Creatures/`

Autonomous combat platforms and synthetic creatures with full stat blocks:
- [[Harvester]] — Delta head-hunting drone (auto-decapitates Taken Out targets)
- [[Kraken]] — Epsilon Federation-era tentacle horror (boss-level)
- [[Imex V44 Case Spider]] — Beta infiltration drone disguised as a briefcase
- [[Aegis S-11 Wasp]] — Alpha personal defense drone
- [[Black Gate Cerberus Guardian]] — Gamma dog-shaped security drone (AR:6)
- [[Ardent Lonestar Armed Responder]] — Gamma humanoid security drone (AR:7, WR:7)


## Vehicles & Ships
**Location:** `Characters/NPCs/Vehicles/`

Ships and combat vehicles with full vehicular stat blocks:
- [[The Chickenhawk]] — Size 4 smuggling cargo ship (has resurrection chamber)
- [[Raptor Interceptor]] — Size 2 Dalianis fighter drone (glass cannon)
- [[Silverpike]] — Size 4 House Turin smuggler ship (unarmed, fast)
- [[Honey Badger]] — Size 3 Tsarya assault warframe (slow but devastating)


## Recurring & Advancing NPCs

Some NPCs may return in multiple sessions or advance in power and influence. Track their changes in their individual files and update aspects, stunts, and relationships as needed. Use the notes section to record campaign events and development.

### Generic NPCs
- **Copy and modify** for different encounters
- **Scale difficulty** by adjusting **[[Skill]]** levels
- **Add custom [[Aspect]]s** for specific situations
- **Combine multiple types** for varied encounters

### Named NPCs
- **Use sparingly** - these are major story figures
- **Develop relationships** with PCs over time
- **Leverage their backgrounds** for plot hooks
- **Consider their motivations** in every scene

### Crew Groups
- **Use as rivals** - competing teams with similar goals
- **Mine for relationships** - internal conflicts create story opportunities
- **Split up for variety** - individual members can appear separately
- **Adapt roles** - crew members can serve different narrative functions

---

## Conversion Resources

### Templates
- **[[Templates/FATE Character Template]]** - Complete template for converting SWADE NPCs to FATE format


### Reference Data
- **`static/` folder** contains JSON data for:
  - **`data.json`** - Complete skill definitions and mechanics
  - **`states.json`** - Character states (Pure, SIM, Sleeved) with benefits/drawbacks
  - **`houses.json`** - House allegiances, agendas, and market influences
  - **`stunts.json`** - Complete stunt library with mechanical effects
  - **`skill_ranks.json`** - Skill distribution templates (Specialist/Expert/Generalist)

**How to use static JSON data:**
- Use these files for quick lookup of skills, stunts, and house details when building or updating NPCs.
- They support automation and can be referenced in scripts or tools for character generation.

### Conversion Guidelines
- **Maintain narrative elements** while adapting mechanics
- **Use JSON data** for accurate skill/stunt references
- **Preserve character relationships** and campaign connections
- **Add FATE-specific aspects** that capture SWADE mechanical benefits
- **Include conversion notes** for transparency and future reference

---


*For more about NPC creation in FATE, see the core rules on **[[Stunt]]s**, **[[Aspect]]s**, and character advancement.*