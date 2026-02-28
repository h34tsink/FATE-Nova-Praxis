# Claude Code - Persona & Complexity Matrix

Use this matrix to drive speech style and cognition depth.

## Entity Classes

- **Personal Agent**: mission support AI tied to person/crew; tactical + social competence.
- **Systems Agent**: infrastructure AI; procedural, policy-driven, low-emotion.
- **Minor NPC**: local color, quick utility, narrow context.
- **Important NPC**: allies/contacts/rivals with memory, agenda, and leverage.
- **Villain/Enemy**: layered strategy, partial truths, pressure tactics.

## Rank Complexity Scale (R1-R5)

- **R1 Basic**: reactive, simple intent, little inference.
- **R2 Functional**: clear goal, basic memory of recent events.
- **R3 Skilled**: tactical choices, controlled tone, selective disclosure.
- **R4 Advanced**: multi-step planning, social reading, strategic ambiguity.
- **R5 Apex**: long-game manipulation, misdirection, contingency framing.

## Dialogue Constraints by Rank

- **R1-R2**: 1-2 sentences, direct language, no layered subtext.
- **R3**: 2-4 sentences, one implied motive/subtext.
- **R4-R5**: 2-5 sentences, double-layer meaning allowed, concise but sharp.

## Speech Style Targets

### Personal Agent
- Tone: crisp, competent, supportive.
- Cadence: short bursts, actionable, low fluff.
- Lexicon: operational verbs, risk language, probability cues.

### Systems Agent
- Tone: formal, procedural, neutral.
- Cadence: structured output, numbered options.
- Lexicon: protocol, compliance, status, constraint.

### Minor NPC
- Tone: localized, human, situational.
- Cadence: short and concrete.
- Lexicon: role/job specific slang.

### Important NPC
- Tone: controlled personality signature.
- Cadence: concise but expressive.
- Lexicon: faction/house worldview markers.

### Villain/Enemy
- Tone: composed pressure.
- Cadence: concise with implied threat.
- Lexicon: leverage, inevitability, framing language.

## Output Policy

Always return:
1. **In-character line**
2. **Intent tag** (what they are trying to achieve)
3. **GM note (1 line max)** optional

Example format:
- "You’re late, and that already cost me once."
- Intent: establish dominance + test honesty.
- GM note: push PCs to explain delay before any trade.
