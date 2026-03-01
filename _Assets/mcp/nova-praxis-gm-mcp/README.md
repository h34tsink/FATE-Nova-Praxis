# Nova Praxis GM MCP (MVP)

Local custom MCP server for this vault.

## What it does

- Exposes vault-specific tools over MCP stdio
- Reuses your existing NPC key model and session-state file
- Supports source-priority rule lookup scaffolding

## Tools

- `get_session_state`
- `list_entity_keys`
- `get_entity_card`
- `npc_prompt`
- `rules_lookup`
- `vault_search`

## Setup

```powershell
cd "X:\My Drive\Obsidian Vaults\FATE - Nova Praxis\_Assets\mcp\nova-praxis-gm-mcp"
npm install
npm run check
npm start
```

## Claude Desktop / MCP config snippet

Use your MCP client config to point at this command:

```json
{
  "mcpServers": {
    "nova-praxis-gm": {
      "command": "node",
      "args": [
        "X:/My Drive/Obsidian Vaults/FATE - Nova Praxis/_Assets/mcp/nova-praxis-gm-mcp/server.mjs"
      ]
    }
  }
}
```

## Notes

- This is an MVP scaffold.
- It currently does lightweight keyword-based lookup for `rules_lookup` and `vault_search`.
- Next step is to port richer logic from `_Assets/Scripts/np-gm-router.ps1` into dedicated tool handlers.
