# Vault Cleanup Review

## Summary
- Scope: redirect stubs, empty files, and frontmatter quality.
- Date: 2026-02-28
- Result: frontmatter syntax clean; redirect stubs now explicitly labeled.

## Redirect Stubs (Kept, now tagged)
These files are compatibility/shortcut notes and were marked with `redirect: true` frontmatter:

- Glossary
- Plot
- Rules and Mechanics
- Sessions
- Generic NPCs
- Named NPCs
- Vantage Station
- Erebos Depths
- Giordino
- New Montreal
- Pneuma-related terms
- Savants
- [[Factions/The Coalition/House military]]
- [[Factions/Hidden Agendas/Black Market]]
- Black Operations
- Existential Threats
- Information Control
- Secret Societies
- Synthesis
- Unseen Court
- Sentinel

## Empty Files (Delete Candidates)
High-confidence removal candidates:

- Kimura
- Recap
- Silvermist
- Untitled 2
- [[Characters/Players/Dr. Lorem (Doc) Ipsum/Untitled]]

Review before deletion:

- Notes

## Notes
- Oversized frontmatter values were found only in `[[.trash/Briar Blackwood]]` and are non-operational because they are in trash.
- No malformed or tab-indented frontmatter remains in active markdown files.
