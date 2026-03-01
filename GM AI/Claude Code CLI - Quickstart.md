# Claude Code CLI — GM AI Quickstart

**Summary:** Use one command to generate in-character prompt payloads from entity cards.

## Command
From vault root:

```powershell
pwsh -File .\_Assets\Scripts\np-gm-npc.ps1 -Npc valare-integrated -Context "Players repaired mnemonic core","She demands merger terms first","She gives off-grid hide sites" -Copy
```

## Router Commands (Slash-Style)
From vault root:

```powershell
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm -profile full -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm -profile rules -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc valare-integrated -mode summary
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc valare-integrated -context "Players repaired mnemonic core" "She demands merger terms first" "She gives likely hide sites" -style table-short -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -game "What is the likely HPA response timeline?" -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -game "What is the likely HPA response timeline?" -domain history -style gm-deep -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc nowak -player "Aeddarius" "Where is your fork hiding?" -style table-short -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /state-set -active-npc nowak -objective "Delay disclosure until exfil window" -scene "Mutineers entering deck B" "Kimura comms dark" "PCs demand full disclosure"
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /state-show
```

## Speed Aliases (Recommended)

Load aliases for the current terminal session:

```powershell
. .\_Assets\Scripts\np-gm-aliases.ps1
```

Then use short commands:

```powershell
gm -profile full -copy
gmstate set -active-npc nowak -scene "Mutineers entering deck B" "Kimura comms dark"
npc -mode prompt -style table-short -copy
gmask -game "What can they prove right now?" -domain rules -style gm-deep -copy
```

## One-Step Bootstrap (Recommended)

Dot-source bootstrap to load aliases and seed state from latest session note:

```powershell
. .\_Assets\Scripts\Start-GMSession.ps1
```

Seed from a specific note and copy full context:

```powershell
. .\_Assets\Scripts\Start-GMSession.ps1 -SessionNote "Sessions/Session 9/Session 9 - Beats (GM Runtime).md" -CopyContext
```

Override inferred values:

```powershell
. .\_Assets\Scripts\Start-GMSession.ps1 -Npc nowak -Objective "Delay disclosure until extraction" -Scene "Mutineers entering deck B" "Kimura comms dark"
```

- `-Npc`: one of `kestrel nowak isabella chimera valare-fork valare-integrated seren kal paddock lighthouse`
- `-Context`: 1-3 scene bullets
- `-Goal`: optional override for current objective
- `-Secret`: optional override for hidden info
- `-Copy`: copy generated prompt directly to clipboard
- `-Json`: emit JSON payload for automation wrappers
- `-ShowNpcs`: list supported NPC keys

Router modes:
- `/gm`: load GM runtime context block
- `/gm -profile full`: load full-boat context (rules/history/lore/location/gear)
- `/npc`: build NPC prompt or summary/details/attitude/mission payload
- `/gm-ask -game`: ask the game/lore/rules oracle
- `/gm-ask -game -domain <area>`: target question scope (`core|full|rules|history|lore|location|gear`)
- `/gm-ask -npc`: ask as storyteller backstage or as in-scene player (`-player`)
- `/state-set`: set session memory (`active-npc`, `objective`, `scene`)
- `/state-show`: view current state
- `/state-clear`: reset state

## Typical Loop
1. Set state once at scene start (`/state-set`).
2. Use short calls (`npc`, `gmask`, `gm`) without repeating context each turn.
3. Paste output into Claude Code CLI chat.
4. Repeat per beat; update state only when scene facts change.

## Lore
This workflow uses entity card metadata as default source for class/rank/goal/secret and keeps output consistent with `GM AI/Claude Code - Prompt Pack.md` block 1.

## Links
- [[GM AI/NPC Command Board]]
- [[GM AI/Claude Code - Prompt Pack]]
- [[GM AI/Entity Cards/Valare Integrated (R4 Personal Agent Ally)]]

#ttrpg #nova-praxis #gm-ai #cli
