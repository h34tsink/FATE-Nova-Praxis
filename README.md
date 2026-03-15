# FATE Nova Praxis

Nova Praxis campaign vault for Obsidian, including lore, session operations, mechanics references, structured TypeScript game data, a SvelteKit character-creator app, a Claude Code GM plugin, and a Discord bot for at-table use.

## What this repository contains

- Obsidian vault content for running a FATE-based Nova Praxis campaign
- GM runtime assets (entity cards, prompts, command boards) under `GM AI/`
- Structured TypeScript game data under `Data/`
- Claude Code GM plugin under `nova-praxis-gm/`
- Character creator web app under `nova-praxis-character-creator/`
- Discord bot (PostgreSQL + Anthropic API) under `nova-praxis-discord/`

---

## Quick start

### 1) Open the vault

1. Open Obsidian
2. Open folder: this repository root
3. Start from `Index.md` and section MOCs (`*/Index.md`)

### 2) Character creator (SvelteKit)

```powershell
cd .\nova-praxis-character-creator
npm install
npm run dev
```

Scripts: `dev` · `build` · `preview` · `check`

### 3) GM Cockpit plugin (Claude Code)

Install from the local marketplace:

```bash
claude plugin install nova-praxis-gm@nova-praxis-local
```

Update after editing plugin source files:

```bash
claude plugin update nova-praxis-gm@nova-praxis-local
cd C:\Users\satur\.claude\plugins\local-marketplace
git add -A && git commit -m "update nova-praxis-gm"
```

Slash commands: `/gm-start` · `/rules` · `/npc` · `/scene` · `/recap` · `/aspects`

### 4) Discord bot

See [Discord bot](#discord-bot) section below.

---

## Discord bot

A Discord.js + PostgreSQL bot that gives players and the GM slash-command access to vault data, with Claude-powered AI responses for complex queries.

### Stack

| Layer | Tech |
|-------|------|
| Bot | Discord.js v14, TypeScript, Node 20 |
| Database | PostgreSQL 16 (Docker) |
| AI | Anthropic API (`claude-sonnet-4-5`) |
| Runtime | Docker Compose (fully self-contained) |

### Setup

```bash
cd nova-praxis-discord
cp .env.example .env
# Fill in DISCORD_TOKEN, DISCORD_GUILD_ID, ANTHROPIC_API_KEY
```

**`.env` variables:**

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal |
| `DISCORD_GUILD_ID` | Your server's guild ID |
| `GM_ROLE_NAME` | Role name that grants GM access (default: `GM`) |
| `PGPASSWORD` | Postgres password (default: `changeme`) |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude responses |
| `VAULT_PATH` | Absolute path to vault root (mounted read-only into Docker) |

### Docker (recommended)

```bash
npm run docker:up        # build and start bot + db
npm run docker:logs      # tail bot logs
npm run docker:restart   # full rebuild + data reload
npm run docker:down      # stop everything
```

On first start the bot auto-imports all vault data (glossary, rules, entities, characters, sessions, game data).

### Manual / local dev

```bash
npm install
npm run migrate          # create DB schema
npm run import           # import all vault data
npm run dev              # run bot with tsx (hot-reload)
```

Other data scripts:

```bash
npm run import:glossary
npm run import:rules
npm run import:entities
npm run import:characters
npm run import:game-data
npm run reset-db         # drop and recreate schema
npm run reload           # reset-db + full import
```

### Slash commands

| Command | Access | Description |
|---------|--------|-------------|
| `/lookup` | All | Look up augmentations, gear, skills, sleeves |
| `/glossary` | All | Search the Nova Praxis glossary |
| `/character` | All | Display a PC or named NPC sheet |
| `/rules` | All | Rules question — GM gets full answer, players get summary |
| `/recap` | All | Current session state — GM sees full detail, players see public version |
| `/ask` | GM | Ask Claude anything with full vault context |
| `/player-ask` | All | Ask Claude a lore/rules question (player-safe response) |
| `/npc` | GM | Generate voice-accurate NPC dialogue from entity cards |
| `/scene` | GM | Frame a scene with zones, aspects, NPCs, and compels |
| `/aspects` | GM | Generate or manage FATE aspects for scenes |
| `/gm-start` | GM | Bootstrap a session — loads context, NPCs, scene lineup |
| `/sync` | GM | Trigger a manual vault data reload |

**GM role:** any user with the role named in `GM_ROLE_NAME`. GM-only commands reply ephemerally. GM responses for `/rules` and `/recap` include a **Share with Players** button to post a player-safe version publicly.

---

## Key repository areas

| Folder | Purpose |
|--------|---------|
| `Characters/` | Player characters and Named NPCs |
| `Factions/` | Houses, ideologies, hidden agendas, coalitions |
| `Locations/` | Stations, planets, virtual spaces |
| `Sessions/` | Logs, runtime state, recap material |
| `Rules and Mechanics/` | Active rules references |
| `Mechanics/` | Legacy rules material (do not add new content here) |
| `Glossary/` | Canonical term definitions |
| `GM AI/` | Runtime prompts, entity cards, command board |
| `Data/` | Structured TypeScript gameplay data |
| `nova-praxis-gm/` | Claude Code GM plugin source |
| `nova-praxis-discord/` | Discord bot source |
| `nova-praxis-character-creator/` | SvelteKit character creator |
| `_Assets/Scripts/` | Automation and maintenance scripts |

## Automation scripts

- `_Assets/Scripts/conni_audit.ps1` – vault health and style audit
- `_Assets/Scripts/create_glossary.py` – glossary generation helper
- `_Assets/Scripts/Enable-RepoGitHooks.ps1` – enable large-file pre-push blocker

---

## Git and sync notes

- Default branch: `main`
- Remote: `https://github.com/h34tsink/FATE-Nova-Praxis.git`
- Do not commit large binary video files (`.mp4`) to git history

### Pre-push size guard

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\_Assets\Scripts\Enable-RepoGitHooks.ps1
```

Default limit: 90 MB per blob. Override for a session:

```powershell
$env:GIT_MAX_FILE_MB = 80
```

---

## Conventions

- Prefer linking existing notes over duplicating canon
- Keep terminology aligned to `Glossary/`
- Use `Rules and Mechanics/` as the active rules source (not legacy `Mechanics/`)
- All vault markdown follows Conni Mode conventions (`Templates/Conni Mode.md`)

## License

No license has been declared yet.
