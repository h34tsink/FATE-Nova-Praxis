---
aliases:
  - humanizer
  - gm humanizer
  - narrative polish mode
tags:
  - gm-ai
  - writing
  - style
  - runtime
---

# Narrative Humanizer Mode

**Summary:** Post-pass style mode for making NPC dialogue and scene text sound natural and specific without changing canon, mechanics, or intent.

## Lore

Nova Praxis table text should feel like a person in-world said it, not a neutral assistant. This mode keeps the transhuman/corporate tone but removes generic AI phrasing and repetitive rhythm.

## Mechanics

### Trigger

Use this mode for:
- NPC in-character lines
- GM narration and scene framing
- Session recap prose

Do **not** use this mode for:
- Rules Adjudication Mode outputs
- quoted canon excerpts
- mechanical/stat blocks

### Procedure

1. Preserve facts first (names, numbers, rules, timeline, outcome).
2. Fix skeleton (sentence rhythm and structure), then vocabulary.
3. Remove obvious assistant wrappers and generic filler.
4. Keep voice specific to speaker/faction/rank.
5. Re-check meaning: no drift in mechanics or continuity.

### Output Modes

- **light** (default): minimal cleanup, keep original structure.
- **medium**: stronger rhythm/vocab rewrite while preserving content.
- **aggressive**: heavy rewrite for readability and voice; only when requested.

### Guardrails

- Keep technical meaning unchanged unless source is clearly incorrect.
- Preserve proper nouns, domain terms, and required policy language.
- Avoid style churn if text already reads clean and human.
- Prefer concrete subject+verb statements over abstract phrasing.

### Fast Fix Patterns

- `serves as` -> `is`
- `features/boasts/offers` -> `has`
- abstract subject -> named actor
- generic claim -> specific fact grounded in source

## Continuity

- If uncertain, include a short confidence note instead of bluffing.
- Narrative polish never overrides canon or rules.
- If output is a mechanics answer, switch to [[CLAUDE#Rules Adjudication Mode]] and skip this mode.

## Links

- [[CLAUDE]]
- [[GM AI/Claude Code - Persona & Complexity Matrix]]
- [[GM AI/Claude Code - Prompt Pack]]
