---
name: recap
description: "Session state summary — where are we right now? Quick situational awareness in 10 seconds."
---

## Vault Operations

Prefer Obsidian CLI commands (via Bash tool). On this system the CLI binary is `"C:/Users/satur/AppData/Local/Obsidian/Obsidian.com"` — use this path instead of `obsidian` in all Bash commands. Prefer the CLI for discovering and reading session files. Fall back to Glob/Read if the CLI is unavailable or if CLI reads return ambiguous results.

# Session Recap

Generate a compact "where are we right now?" summary for the GM.

## Your Task

Read current session state and produce an at-a-glance summary.

## Source Files (read in order)

1. Find the most recent session folder:
   ```bash
   obsidian files path="Sessions" sort=modified limit=5
   ```

2. Read session state files using CLI wikilink resolution:
   ```bash
   obsidian read file="Session N - GM Command Board"
   obsidian read file="Session N - Live Dashboard"
   obsidian read file="Session N - Ops Index"
   obsidian read file="Session N - Guide"
   obsidian read file="Session N - Scenes and Zones"
   ```
   Skip any that don't exist.

3. Read arc context:
   ```bash
   obsidian read file="Cold Start Syndicate - Campaign Summary"
   ```

If CLI is unavailable, fall back to Glob for `Sessions/Session */` folders and direct Read for each file.

## Response Format

Return in this exact format — keep it scannable in under 10 seconds:

---

**Current Scene:** [Scene name + location — 1 line]

**What Just Happened:** [Last major event or decision — 1-2 lines]

**Active NPCs:**
- [Name] (`[token]`) — [current stance/mood — few words]

**PC Status:** [Any tracked stress, consequences, fate points, or conditions — or "nominal" if nothing notable]

**Pacing:** [Exposure clock state / tension level / how much runway is left]

**Open Threads:**
- [Unresolved thread or pending compel — 1 line each, max 4]

**Next Beat:** [What's most likely to happen next — 1 line]

---

## Constraints

- Pull from actual vault files, not memory.
- If session state files don't exist or are empty, say so and pull what you can from the session guide.
- Keep total output under 20 lines.
- This is a read-only operation.
