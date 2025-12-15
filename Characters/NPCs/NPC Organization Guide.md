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
- [[Cyber-Merc]]
- [[Security Guard]]


## Named NPCs (Major Characters)
**Location:** `Characters/NPCs/Named NPCs/`

These are unique individuals with:
- Full character development and backgrounds
- Complex motivations and relationships
- Detailed stat blocks with multiple **[[Aspect]]s**
- Campaign-significant roles
- Story hooks and adventure seeds

**Examples:**
- [[Gabriel Adams]] - Complex patron/antagonist
- [[Greyton]] - Legendary assassin
- [[Jace Welder]] - Idealistic ship captain
- [[Durian Konrad]] - Political manipulator
- [[Xavier Wilhelm]] - Unity-focused warrior
- [[Tiver Andlat]] - Criminal savant hacker
- [[Christov Draiku]] - SIM chef/programmer
- [[Kestrel]] - Fixer and information broker
- [[Isabella Nowak]] - Desperate House executive
- [[Characters/NPCs/Named NPCs/Valare]] - Defector savant (deceased but recoverable)
- [[Characters/Savage Worlds/NPCs/Named NPCs/Chimera]] - Major campaign villain *(still being converted)*


## Crew Groups
**Location:** `Characters/NPCs/`

Pre-designed groups of NPCs that work together, providing:
- **Ready-made relationships** and group dynamics
- **Factional diversity** and built-in conflicts
- **Balanced skill coverage** for various scenarios
- **Story hooks** through inter-character tensions

**Examples:**
- [[The Ebon Jackal Crew]] - Diverse salvage crew with hidden agendas


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