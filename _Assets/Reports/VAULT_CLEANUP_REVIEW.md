# Vault Cleanup Review

## Summary
- Scope: redirect stubs, empty files, and frontmatter quality.
- Date: 2026-02-28
- Result: frontmatter syntax clean; redirect stubs now explicitly labeled.

## Redirect Stubs (Kept, now tagged)
These files are compatibility/shortcut notes and were marked with `redirect: true` frontmatter:

- [[Glossary]]
- [[Plot]]
- [[Rules and Mechanics]]
- [[Sessions]]
- [[Characters/NPCs/Generic NPCs]]
- [[Characters/NPCs/Named NPCs]]
- [[Locations/Vantage Station]]
- [[Locations/Sol System/Erebos Depths]]
- [[Locations/Exoplanets/Giordino]]
- [[Locations/Exoplanets/New Montreal]]
- [[Glossary/Pneuma-related terms]]
- [[Factions/Savants]]
- [[Factions/The Coalition/House military]]
- [[Factions/Hidden Agendas/Black Market]]
- [[Factions/Hidden Agendas/Black Operations]]
- [[Factions/Hidden Agendas/Existential Threats]]
- [[Factions/Hidden Agendas/Information Control]]
- [[Factions/Hidden Agendas/Secret Societies]]
- [[Factions/Hidden Agendas/Synthesis]]
- [[Factions/Hidden Agendas/Unseen Court]]
- [[Stations/Sentinel]]

## Empty Files (Delete Candidates)
High-confidence removal candidates:

- [[.trash/Kimura]]
- [[.trash/Recap]]
- [[.trash/Silvermist]]
- [[.trash/Untitled 2]]
- [[.trash/Untitled]]

Review before deletion:

- [[Characters/Players/Aeddarius Crucial/Notes]]

## Notes
- Oversized frontmatter values were found only in `[[.trash/Briar Blackwood]]` and are non-operational because they are in trash.
- No malformed or tab-indented frontmatter remains in active markdown files.
