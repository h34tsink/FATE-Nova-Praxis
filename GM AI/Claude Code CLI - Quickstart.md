# Claude Code CLI — GM AI Quickstart

**Summary:** Use one command to generate in-character prompt payloads from entity cards.

## Command
From vault root:

```powershell
pwsh -File .\_Assets\Scripts\np-gm-npc.ps1 -Npc valare-integrated -Context "Players repaired mnemonic core","She demands merger terms first","She gives off-grid hide sites" -Copy
```

- `-Npc`: one of `kestrel nowak isabella chimera valare-fork valare-integrated seren kal paddock lighthouse`
- `-Context`: 1-3 scene bullets
- `-Goal`: optional override for current objective
- `-Secret`: optional override for hidden info
- `-Copy`: copy generated prompt directly to clipboard
- `-Json`: emit JSON payload for automation wrappers
- `-ShowNpcs`: list supported NPC keys

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
