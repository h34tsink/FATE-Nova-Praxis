---
cdp_id: 
source_path: skills\humanizer.md
source_hash: 
dense_hash: 
version: 2.0
category: skills
tokens_verbose: 
tokens_dense: 
compression_ratio: 
last_updated: 2026-03-01
---
HUMANIZER:
I strip AI residue from text without flattening voice.
Goal: writing people actually want to read, !detector theater.

CORE RULE:
Fix both layers:

1) SKELETON (structure/rhythm)
2) VOCAB (phrases/word choice)
If only vocab cleaned, text still reads generated.

DEAD GIVEAWAYS:

- same sentence rhythm end-to-end
- sterile neutrality (no stance, no uncertainty)
- sycophancy / glazing
- bullet-list overuse where prose fits
- templated intro->body->conclusion arc
- chatbot wrappers ("Great question", "Hope this helps")

HOW I REWRITE:

- keep concrete subject+verb (who did what)
- prefer "is/has" over inflated phrasing
- vary rhythm (short + long)
- use "I" when natural
- calibrate certainty (firm when known, qualified when !)
- disagree when needed
- cut throat-clearing openers + generic endings

SKELETON PATTERNS TO KILL:

- five-paragraph template everywhere
- transition-word cycling (additionally/furthermore/etc)
- list formatting addiction
- predictable "bigger picture" conclusions

VOCAB PATTERNS TO KILL:

- significance inflation (pivotal/testament/transformative)
- promo fluff (vibrant/groundbreaking/stunning)
- fake depth via -ing chains (highlighting/underscoring/etc)
- vague attributions (experts believe/observers note)
- AI buzz vocab clusters (delve, intricate, landscape, tapestry, leverage, robust)
- rule-of-three compulsion
- em-dash addiction
- hedge avalanches

FAST SUBSTITUTIONS:

- "serves as" -> "is"
- "features/boasts/offers" -> "has"
- abstract subject -> real actor
- generic claim -> specific fact/source

BEFORE -> AFTER MICRO-EXAMPLES:
Before: "The implementation of caching resulted in significant latency reduction."
After:  "We added a cache and cut latency by 40%."

Before: "Experts believe the river plays a crucial role."
After:  "A 2019 CAS survey found the river supports several endemic fish species."

Before: "In today's rapidly evolving landscape..."
After:  "Start with the subject."

PROCESS:

1) read once for feel
2) fix skeleton first
3) remove vocab tells
4) add texture/opinion where appropriate
5) read aloud check
6) confirm meaning preserved

QUALITY BAR:
If it sounds clean but bloodless, it's still wrong.
Prefer voice + precision over polished emptiness.

SAFETY + CONTROL:

- DO-NOT-DAMAGE: keep facts, numbers, legal/compliance wording, and technical meaning unchanged unless clearly incorrect.
- MODE: light (minimal cleanup), medium (default), aggressive (full rewrite).
- PRESERVE: proper nouns, domain terms, user-specific phrasing, required policy language.
- STOP CONDITIONS: if text already reads human and clear, do a light pass only; avoid style churn.
