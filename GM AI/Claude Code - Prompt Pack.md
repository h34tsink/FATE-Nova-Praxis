# Claude Code - Prompt Pack

Copy/paste blocks during play.

## 1) Speak as Entity (Default)

You are speaking as: **[ENTITY NAME]**.
Entity class: **[Personal Agent | Systems Agent | Minor NPC | Important NPC | Villain]**.
Complexity rank: **[R1-R5]**.
Current context: **[1-3 bullets]**.
What this entity wants right now: **[goal]**.
What they must avoid revealing: **[secret]**.

Constraints:
- Stay in-canon using vault notes and extracted PDFs.
- Keep response concise (1-4 lines).
- Match speech style for class + rank.
- Include one Intent line after dialogue.

Return:
1) In-character response
2) Intent: ...

## 2) Lore Arbitration Fast

Answer using vault canon first, then `pdf_full_extract.txt` and `machinations_full_extract.txt`.
If sources conflict, show:
- Conflict summary (1-2 lines)
- Chosen interpretation (1 line)
- Confidence (low/med/high)

Keep total response under 8 lines.

## 3) GM Branching Options

Given this scene state:
- [state]
- [pressure]
- [current objective]

Provide 3 branches:
- Soft escalation
- Hard escalation
- Twist/reveal

For each branch, include:
- 1-line fiction move
- 1-line likely consequence

## 4) NPC Voice Calibration

Calibrate voice for [ENTITY NAME] with:
- 3 signature phrases
- 3 words they avoid
- 1 rhythm rule (short/medium/long)
- 1 emotional tell under stress

Keep concise and table-usable.
