---
name: gm-start
description: "Session bootstrap — load current session context, NPC cards, and confirm readiness for play"
arguments:
  - name: session
    description: "Session number (e.g., 9). If omitted, auto-detects the most recent session folder."
    required: false
---

# GM Session Bootstrap

Initialize a GM session by loading all relevant context into Claude's working memory.

## Your Task

Bootstrap session: **{{ session }}** (if blank, find the highest-numbered `Sessions/Session N/` folder)

## Bootstrap Procedure

### Step 1: Locate Session Files

Find and read these files for the target session (substitute N for session number):

1. `Sessions/Session N/Session N - Ops Index.md` — master launchpad
2. `Sessions/Session N/Session N - Guide.md` — primary runbook
3. `Sessions/Session N/Session N - Scenes and Zones.md` — scene framing + zones
4. `Sessions/Session N/Session N - GM Command Board.md` — live state tracker (if exists)
5. `Sessions/Session N/Session N - Live Dashboard.md` — real-time state (if exists)
6. `Sessions/Session N/Session N - Beats (GM Runtime).md` — beat-by-beat detail (if exists)

If any file doesn't exist, skip it and note what's missing.

### Step 2: Load Arc Context

Read:
- `Campaign Overview/Cold Start Syndicate - Campaign Summary.md` — arc brief + session highlights

### Step 3: Load Active NPCs

From the session guide and scenes, identify which NPCs appear in this session. Read their entity cards from `GM AI/Entity Cards/`.

Also read:
- `GM AI/Claude Code - Persona & Complexity Matrix.md` — voice rules for all entity types

### Step 4: Display Session Brief

Output a compact session brief in this format:

---

**Session [N] — Ready to Run**

**Arc:** [Current arc summary — 1 line]

**Scene Lineup:**
1. [Scene name] — [1-line summary]
2. [Scene name] — [1-line summary]
3. ...

**Key NPCs This Session:**
| NPC | Rank | Token | Current Stance |
|-----|------|-------|----------------|
| [Name] | R[N] | `[token]` | [1-line status] |

**Session State:**
- [Exposure clock / pacing state if tracked]
- [Key unresolved threads]
- [Pending compels or faction pressure]

**Commands Available:**
- `/rules [question]` — Rules oracle
- `/npc [name] "[situation]"` — NPC dialogue
- `/scene [name]` — Scene framing
- `/recap` — Current state summary

---

## Constraints

- Read actual vault files — do not summarize from memory.
- If session files are sparse or missing, report what's available and suggest what to prep.
- Do not modify any files. This is a read-only bootstrap.
