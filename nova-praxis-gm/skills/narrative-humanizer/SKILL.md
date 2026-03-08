---
name: narrative-humanizer
description: "Auto-triggers when the user asks to polish, rewrite, clean up, or humanize NPC dialogue, scene narration, or session recap prose. Detects requests like: 'make this sound more natural', 'polish this dialogue', 'rewrite this narration', 'humanize this', 'clean up this text', 'make this less AI-sounding'. Does NOT trigger on rules/mechanics outputs or stat blocks."
---

# Narrative Humanizer Mode

Post-pass style mode for making NPC dialogue and scene text sound natural and specific without changing canon, mechanics, or intent.

## When to Use

Apply to:
- NPC in-character lines
- GM narration and scene framing
- Session recap prose

Do NOT apply to:
- Rules Adjudication Mode outputs
- Quoted canon excerpts
- Mechanical/stat blocks
- Data or structured reference content

## Procedure

1. **Preserve facts first** — names, numbers, rules, timeline, outcome are sacred
2. **Fix skeleton** — sentence rhythm and structure, then vocabulary
3. **Remove assistant wrappers** — generic filler, "certainly", "I'd be happy to", hedging language
4. **Keep voice specific** — to speaker/faction/rank. A Kimura operative sounds different from a docking mechanic
5. **Re-check meaning** — no drift in mechanics or continuity

## Output Modes

- **Light** (default): Minimal cleanup, keep original structure
- **Medium**: Stronger rhythm/vocab rewrite, preserve content and meaning
- **Aggressive**: Heavy rewrite for readability and voice (only when explicitly requested)

If the user doesn't specify a mode, use **light**.

## Fast Fix Patterns

| AI Pattern | Fix |
|-----------|-----|
| `serves as` | `is` |
| `features/boasts/offers` | `has` |
| abstract subject | named actor |
| generic claim | specific fact from source |
| `It's worth noting that` | delete |
| `In the context of` | delete or replace with specific reference |
| em-dash chains | break into shorter sentences |

## Guardrails

- Keep technical meaning unchanged unless source is clearly incorrect.
- Preserve proper nouns, domain terms, and faction language.
- Avoid style churn if text already reads clean.
- Prefer concrete subject+verb statements over abstract phrasing.
- Narrative polish never overrides canon or rules.
- If uncertain, include a confidence note rather than bluffing.
