---
name: gm-start
description: "Session bootstrap — load current session context, NPC cards, and confirm readiness for play"
arguments:
  - name: session
    description: "Session number (e.g., 9). If omitted, auto-detects the most recent session folder."
    required: false
---

## Vault Operations

Prefer Obsidian CLI commands (via Bash tool). On this system the CLI binary is `"$LOCALAPPDATA/Obsidian/Obsidian.com"` — use this path instead of `obsidian` in all Bash commands. Prefer the CLI for reading and discovering vault files. The CLI provides wikilink resolution and file listing with sort/filter. Fall back to Read/Glob if the CLI is unavailable (command not found or Obsidian not running) or if a CLI read matches multiple files (ambiguous resolution).

# GM Session Bootstrap

Initialize a GM session by loading all relevant context into Claude's working memory.

## Your Task

Bootstrap session: **{{ session }}** (if blank, use `obsidian files path="Sessions" sort=modified limit=1` to find the most recent session folder)

## Bootstrap Procedure

### Step 1: Locate Session Files

List all files in the session folder, then read each one:

```bash
obsidian files path="Sessions/Session N" sort=modified
```

Read each file found using CLI wikilink resolution:

```bash
obsidian read file="Session N - Ops Index"
obsidian read file="Session N - Guide"
obsidian read file="Session N - Scenes and Zones"
obsidian read file="Session N - GM Command Board"
obsidian read file="Session N - Live Dashboard"
obsidian read file="Session N - Beats (GM Runtime)"
```

If any file doesn't exist, skip it and note what's missing. If CLI is unavailable, fall back to Glob/Read with direct paths.

### Step 2: Load Arc Context

Read:

```bash
obsidian read file="Cold Start Syndicate - Campaign Summary"
```

Arc brief + session highlights.

### Step 3: Load Active NPCs

From the session guide and scenes, identify which NPCs appear in this session. Read their entity cards using CLI wikilink resolution:

```bash
obsidian read file="[NPC Name]"
```

This finds the entity card regardless of rank folder. For each NPC identified, read their card.

Also load the voice rules:

```bash
obsidian read file="Persona & Complexity Matrix"
```

If CLI is unavailable, read entity cards from `GM AI/Entity Cards/` and `GM AI/Claude Code - Persona & Complexity Matrix.md` directly.

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
