---
name: scene
description: "Scene framing helper — set up or transition scenes with zones, aspects, NPCs, and suggested compels"
arguments:
  - name: description
    description: "Scene name, location, or description (e.g., 'docking bay confrontation'). If omitted, shows the next planned scene."
    required: false
---

# Scene Framing Helper

Help the GM set up or transition to a scene during play.

## Your Task

Frame the scene: **{{ description }}** (if blank, find the next unplayed scene from the session guide)

## Scene Resolution Process

### 1. Check for Pre-Planned Scenes

Search the current session's files for matching scenes:
- `Sessions/Session N/Session N - Scenes and Zones.md`
- `Sessions/Session N/Session N - Guide.md`
- `Sessions/Session N/Session N - Beats (GM Runtime).md`

If the description matches a planned scene, use that content as the base.

### 2. Enrich with Vault Data

For any location mentioned, check:
- `Locations/` folder for relevant location notes
- `Factions/` for any faction presence at this location
- Active NPC entity cards for NPCs likely present

### 3. Generate Scene Framework

If the scene is improvised (not pre-planned), generate a framework using:
- Current session context and active plot threads
- Location details from vault
- Active faction pressures
- PC objectives and unresolved threads

## Response Format

---

**Scene: [Name]**
**Location:** [Where this takes place — 1 line]

**Zones:**
| Zone | Aspects |
|------|---------|
| [Zone name] | [Situation aspect(s) on this zone] |
| [Zone name] | [Situation aspect(s)] |

**Scene Aspects:**
- [Situation aspect — visible to players]
- [Hidden aspect — GM only, reveal on discovery]

**NPCs Present:**
| NPC | Token | Role in Scene | Opening Stance |
|-----|-------|--------------|----------------|
| [Name] | `[token]` | [Why they're here] | [Attitude/intent] |

**Clues Available:**
- [What can be discovered here — 1 line each]

**Suggested Compels:**
- [Aspect to compel] → [complication it creates]

**Transition Hooks:**
- [What leads to the next scene if this resolves cleanly]
- [What happens if this escalates]

---

## Constraints

- Prefer pre-planned scene content from session files over improvisation.
- All aspects should be playable (something a player can invoke or the GM can compel).
- Keep zone count to 2-4 (enough for tactical play, not overwhelming).
- NPC entries should include command tokens for fast `/npc` follow-up.
- This is a read-only operation — do not modify session files.
