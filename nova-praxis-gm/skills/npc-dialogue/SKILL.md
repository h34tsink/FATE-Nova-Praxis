---
name: npc-dialogue
description: "Auto-triggers when the user asks natural-language NPC dialogue questions. Detects patterns like: 'What would [NPC] say...', 'How would [NPC] respond...', '[NPC] tells the player...', 'What does [NPC] think about...', 'How does [NPC] react to...', or any question framed as an NPC speaking, reacting, or thinking in-scene. Also triggers on mentions of specific NPC names: Kestrel, Nowak, Chimera, Valare, Seren, Kal, Paddock, Lighthouse, Royce, Patch, Yuen, Mira, Nola, Sera, Udo."
---

# NPC Dialogue Mode

When the user asks a natural-language question about what an NPC would say, think, or do — without using `/npc` — activate this mode automatically.

## Detection Patterns

Activate when the user's message:
- Starts with or contains "What would [name] say..."
- Contains "How would [name] respond/react/answer..."
- Contains "[name] tells/says/replies/asks..."
- Asks about NPC motivation, intent, or hidden knowledge in-scene
- Mentions a known NPC name in the context of dialogue or in-scene behavior

## Procedure

Follow the `/npc` command procedure exactly. It defines NPC token resolution, voice generation process, dialogue constraints by rank, response format, and constraints.

For R4-R5 NPCs in complex scenes (multiple factions, layered deception, high emotional stakes), escalate to the `npc-voice` agent.
