---
name: recap
description: "Session state summary — where are we right now? Quick situational awareness in 10 seconds."
---

# Session Recap

Generate a compact "where are we right now?" summary for the GM.

## Your Task

Read current session state and produce an at-a-glance summary.

## Source Files (read in order)

1. Find the highest-numbered `Sessions/Session N/` folder
2. Read any of these that exist:
   - `Session N - GM Command Board.md` (live state)
   - `Session N - Live Dashboard.md` (real-time tracker)
   - `Session N - Ops Index.md` (master index)
   - `Session N - Guide.md` (session runbook)
   - `Session N - Scenes and Zones.md` (scene details)
3. Read `Campaign Overview/Cold Start Syndicate - Campaign Summary.md` for arc context

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
