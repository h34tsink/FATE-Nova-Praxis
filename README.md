# FATE Nova Praxis

Nova Praxis campaign vault for Obsidian, including lore, session operations, mechanics references, structured data files, and a SvelteKit character-creator app.

## What this repository contains

- Obsidian vault content for running a FATE-based Nova Praxis campaign
- GM runtime assets (entity cards, prompts, command boards)
- Structured TypeScript game data under `Data/`
- Local MCP server scaffold for GM tooling under `_Assets/mcp/nova-praxis-gm-mcp/`
- Character creator web app under `nova-praxis-character-creator/`

## Quick start

### 1) Open the vault

1. Open Obsidian.
2. Open folder: this repository root.
3. Start from `Index.md` and section MOCs (`*/Index.md`).

### 2) Character creator (SvelteKit)

```powershell
cd .\nova-praxis-character-creator
npm install
npm run dev
```

Useful scripts:

- `npm run dev` – local development server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run check` – type checking

### 3) Local MCP server (recommended on cloud-synced vaults)

Install/sync to local AppData (avoids Google Drive/OneDrive npm file-lock issues):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\_Assets\Scripts\Install-NovaPraxisMcpLocal.ps1
```

Write MCP config (with backup):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\_Assets\Scripts\Set-NovaPraxisMcpConfig.ps1
```

## Key repository areas

- `Characters/` – player and NPC records
- `Factions/` – houses, ideologies, hidden agendas, coalition structures
- `Locations/` – stations, planets, and virtual spaces
- `Sessions/` – logs, runtime state, recap material
- `Rules and Mechanics/` – active rules references
- `Mechanics/` – older/legacy mechanics material
- `Glossary/` – canonical terms
- `GM AI/` – runtime prompts, entity cards, command board
- `Data/` – structured TypeScript gameplay data
- `_Assets/Scripts/` – automation and maintenance scripts

## Automation scripts

- `_Assets/Scripts/conni_audit.ps1` – vault health and style audit
- `_Assets/Scripts/create_glossary.py` – glossary generation helper
- `_Assets/Scripts/Install-NovaPraxisMcpLocal.ps1` – sync/install MCP locally
- `_Assets/Scripts/Set-NovaPraxisMcpConfig.ps1` – configure Claude MCP entry

## Git and sync notes

- Default branch: `main`
- Remote: `https://github.com/h34tsink/FATE-Nova-Praxis.git`
- Do not commit large binary video files (especially `.mp4`) to git history
- If a push is rejected for large files, remove oversized blobs before retrying

## Conventions

- Prefer linking existing notes over duplicating canon
- Keep terminology aligned to `Glossary/`
- Treat `Rules and Mechanics/` as the active rules source over legacy folders

## License

No license has been declared yet. Add one if you plan public reuse/derivatives.
