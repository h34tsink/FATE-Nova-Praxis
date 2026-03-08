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

## Response Protocol

Follow the exact same protocol as the `/rules` command:

### Source Priority (highest to lowest)
1. `Nova Praxis Rulebook (Cleaned).txt`
2. `pdf_full_extract.txt`
3. `Rules and Mechanics/*.md`
4. `Data/*.ts`
5. `Glossary/`

### Response Format

**Answer:** [One clear ruling sentence.]

**Exceptions/Modifiers:**
- [At least one edge case, state bonus, stunt modifier, or situational rule]

**Source:** [File(s) consulted]

**Confidence:** [high|medium|low] — [reason]

### Constraints
- Ground every answer in vault files, not general FATE knowledge.
- If two sources conflict, prefer the higher-priority source and note the conflict.
- Always check for at least one exception/modifier.
- Keep total response scannable in under 10 seconds.
- Flag uncertainty rather than guessing.
- Do NOT apply Narrative Humanizer Mode to rules outputs.
