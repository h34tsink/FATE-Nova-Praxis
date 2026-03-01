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
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc valare-integrated -mode summary
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc valare-integrated -context "Players repaired mnemonic core" "She demands merger terms first" "She gives likely hide sites" -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -game "What is the likely HPA response timeline?" -Copy
pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc nowak -player "Aeddarius" "Where is your fork hiding?" -Copy
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
- `/npc`: build NPC prompt or summary/details/attitude/mission payload
- `/gm-ask -game`: ask the game/lore/rules oracle
- `/gm-ask -npc`: ask as storyteller backstage or as in-scene player (`-player`)

## Typical Loop
1. Run command with scene bullets.
2. Paste output into Claude Code CLI chat.
3. Send: "Respond in 1-4 lines + Intent."
4. Repeat per beat.

## Lore
This workflow uses entity card metadata as default source for class/rank/goal/secret and keeps output consistent with `GM AI/Claude Code - Prompt Pack.md` block 1.

## Links
- [[GM AI/NPC Command Board]]
- [[GM AI/Claude Code - Prompt Pack]]
- [[GM AI/Entity Cards/Valare Integrated (R4 Personal Agent Ally)]]

#ttrpg #nova-praxis #gm-ai #cli
