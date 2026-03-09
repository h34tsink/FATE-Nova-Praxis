---
name: rules-adjudication
description: "Auto-triggers when the user asks any FATE or Nova Praxis mechanics/rules question naturally in conversation. Detects mentions of: Refresh, Fate Points, stunts, stress, consequences, skills, augmentations, savant programs, SINC, character states (Pure/SIM/Sleeved), sleeves, aspects, invokes, compels, Create Advantage, overcome, attack, defend, contests, conflicts, zones, exchanges, extended actions, spin, stall, pneuma, drones, mnemonic editing, armor, weapons, equipment, or any game procedure question."
---

# Rules Adjudication Mode

When the user asks a mechanics or rules question in natural language (without using `/rules`), activate this mode automatically.

## Detection Patterns

Activate when the user's message:
- Asks "can [character/entity] do X?" where X involves a game mechanic
- Asks "how does X work?" where X is a rules subsystem
- Mentions specific mechanics terms: Refresh, Fate Points, stress, consequences, aspects, stunts, skills, augmentations, savant programs, SINC, character states, sleeves, pneuma, drones, Create Advantage, contests, conflicts, extended actions, spin, stall, armor rating, weapon rating
- Asks about action economy, turn order, or what happens on success/failure/tie
- Asks "what bonus/penalty does X give?"

## Procedure

Follow the `/rules` command procedure exactly. It defines source priority, subsystem routing, response format, and constraints.

For questions spanning multiple subsystems or requiring 3+ source files, escalate to the `rules-oracle` agent.
