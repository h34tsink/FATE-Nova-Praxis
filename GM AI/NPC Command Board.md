---
aliases:
  - npc command board
  - /npc
tags:
  - gm-ai
  - runtime
---

# NPC Command Board

**Summary:** Fast in-session invocation map for entity dialogue. Use `Ctrl+O` (Quick Switcher) or Omnisearch and type the command token (for example `npc kestrel`).

## Lore
This note keeps your runtime entity calls deterministic and table-speed. Each token maps to one canonical entity card with voice profile, motivations, and knowledge boundaries.

## Mechanics
- **Trigger:** You need an in-character line from a known entity.
- **Procedure:**
  1. Open Quick Switcher (`Ctrl+O`) or Omnisearch.
  2. Type one command token below (without backticks if preferred).
  3. Open the matching entity card.
  4. Copy the current context + intent into [[GM AI/Claude Code - Prompt Pack]] section 1.
- **Inputs/Outputs:**
  - Input: command token + scene context
  - Output: 1-4 line in-character response + intent line
- **Failure handling:**
  - If no result appears, reindex search and retry with entity name only.
  - If two results appear, pick the card in `GM AI/Entity Cards/R*/`.

### Command Tokens

- `npc kestrel` → [[GM AI/Entity Cards/R4/Kestrel (R4 Important NPC)]]
- `npc nowak` → [[GM AI/Entity Cards/R4/Isabella Nowak (R4 Important NPC)]]
- `npc chimera` → [[GM AI/Entity Cards/R5/Chimera (R5 Villain)]]
- `npc valare-fork` → [[GM AI/Entity Cards/R4/Valare Fork (R4 Important NPC)]]
- `npc valare-integrated` → [[GM AI/Entity Cards/R4/Valare Integrated (R4 Personal Agent Ally)]]
- `npc seren` → [[GM AI/Entity Cards/R3/Seren (R3 Important Contact)]]
- `npc kal` → [[GM AI/Entity Cards/R2/Kal Paddock (R2 Minor Contact)]]
- `npc lighthouse` → [[GM AI/Entity Cards/R3/Lighthouse Tactical Controller (R3 Systems Agent)]]

### Runnable Example
- Token: `npc nowak`
- Context:
  - Mutineers are advancing on her command deck.
  - PCs demand a full disclosure in exchange for extraction.
  - Kimura comms just went dark.
- Prompt block to use: [[GM AI/Claude Code - Prompt Pack#1) Speak as Entity (Default)]]

### Claude Code CLI Callable Flow

- From vault root, run:
  - `pwsh -File .\_Assets\Scripts\np-gm-npc.ps1 -Npc valare-integrated -Context "Players repaired mnemonic core","She demands merger terms first","She gives off-grid hide sites" -Copy`
- Paste clipboard output into Claude Code CLI and send.
- Full usage: [[GM AI/Claude Code CLI - Quickstart]]

### Fast Router Flow

- Optional one-step startup:
  - `. .\_Assets\Scripts\Start-GMSession.ps1`
  - `. .\_Assets\Scripts\Start-GMSession.ps1 -FromDashboard`
  - `. .\_Assets\Scripts\Start-GMSession.ps1 -DashboardName "Session 9"`
- Load aliases once per terminal session:
  - `. .\_Assets\Scripts\np-gm-aliases.ps1`
- Set table state once per scene:
  - `gmstate set -active-npc nowak -objective "Delay disclosure until exfil" -scene "Mutineers entering deck B" "Kimura comms dark"`
- Pull the active NPC prompt without retyping context:
  - `npc -mode prompt -style table-short -copy`
- Ask game/rules with deeper backstage structure:
  - `gmask -game "What can they prove right now?" -domain rules -style gm-deep -copy`

## Continuity
- **Assumptions:** Command tokens are used as aliases for fast note lookup, not shell-like parser commands.
- **Conflicts to resolve:** If you want literal slash-command execution (`/npc ...` in editor), add a dedicated slash-command plugin later.

## Links
- [[GM AI/Claude Code - GM Runtime System]]
- [[GM AI/Claude Code - Prompt Pack]]
- [[GM AI/Claude Code - Persona & Complexity Matrix]]
- [[GM AI/Entity Card Template]]

#ttrpg #nova-praxis #gm-ai
