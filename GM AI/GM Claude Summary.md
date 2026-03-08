/aspects docking bay under zero-g with Kimura operatives breaching

GM Cockpit Summary — Tell This to Claude on Reload
What was built: A Claude Code plugin called nova-praxis-gm at nova-praxis-gm/ in the vault root, plus Obsidian dashboards with Dataview and Kanban integration.

Plugin contents (12 files):

6 slash commands: /gm-start, /rules, /npc, /scene, /recap, /aspects
3 auto-activating skills: rules-adjudication, npc-dialogue, narrative-humanizer
2 agents: rules-oracle, npc-voice
Obsidian dashboards (4 files):

GM Dashboard.md — command center with Dataview NPC roster, FATE dice, stress reference
GM Session Board.md — Kanban board (Scene Queue, Active NPCs, Open Threads, Compels, Resolved)
Rules and Mechanics/Rules Quick Reference - Unified.md — consolidated cheat sheet
GM AI/NPC Roster - Active.md — Dataview-powered NPC roster
Entity card updates: All 15 entity cards in GM AI/Entity Cards/ now have Dataview-queryable frontmatter: rank, class, faction, token, status.

Vault files updated: Index.md (fully populated), CLAUDE.md (plugin section added).

Plugin registration: Added to installed_plugins.json as nova-praxis-gm@local pointing to D:\ObsidianVaults\FATE - Nova Praxis\nova-praxis-gm, enabled in settings.json.

FATE dice: Your existing Dice Roller plugin supports dice: 4dF natively — added to GM Dashboard.

To test: Try /rules can a SIM invoke aspects?, /npc kestrel "What's your price?", /aspects zero-g cargo bay firefight. Open GM Dashboard.md in Obsidian to see the live Dataview tables. Open GM Session Board.md and switch to Kanban view.