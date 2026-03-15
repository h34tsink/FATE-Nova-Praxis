---
name: aspects
description: "Aspect generator — create FATE Aspects for scenes, NPCs, environments, consequences, maneuvers, equipment, or any game element"
arguments:
  - name: subject
    description: "What to generate aspects for (e.g., 'docking bay firefight', 'Kestrel under pressure', 'zero-g cargo hold', 'biosleeve failure')"
    required: true
---

## Vault Operations

Prefer `obsidian` CLI commands (via Bash tool) for reading vault context (NPC entity cards, locations, factions). Fall back to Read/Grep if the CLI is unavailable or if CLI reads return ambiguous results.

# Aspect Generator

Generate evocative, playable FATE Aspects for any game element in a Nova Praxis session.

## Your Task

Generate Aspects for: **{{ subject }}**

## What Makes a Good Aspect

- **Double-edged:** Can be invoked for advantage AND compelled for trouble
- **Concrete and visual:** Players can picture it, not abstract
- **Actionable:** Suggests what actions make sense (or don't)
- **Nova Praxis tone:** Transhuman, corporate, identity-flavored — not generic fantasy

## Aspect Categories

Generate 3-5 Aspects for each relevant category below. Skip categories that don't apply to the subject.

### Scene Aspects (Obvious)
Visible truths about the current scene that everyone knows. Announce openly.
- Environment, lighting, atmosphere, who's present, what's at stake
- Example: *"Vacuum on the Other Side of That Wall"*, *"Every Eye Sees"*

### Scene Aspects (Hidden)
Truths that exist but aren't obvious. Discoverable via Create Advantage / Assessment.
- Hidden exits, surveillance, concealed NPCs, structural weaknesses, betrayals in progress
- Example: *"Security Feeds Looping"*, *"Backup Incoming"*

### Scene Aspects (Dynamic)
Aspects that emerge or evolve mid-scene as the situation changes.
- Escalating danger, shifting loyalties, deteriorating conditions
- Example: *"Fire Spreading"*, *"Oxygen Running Low"*, *"Crowd Turning Hostile"*

### Maneuver Aspects (Temporary)
Aspects a PC could create with Create Advantage. Suggest the skill that creates it.
- Tactical positions, distractions, environmental manipulation, social leverage
- Format: *"Aspect Name"* (Skill: [skill name])
- Example: *"Pinned Down"* (Skill: Firearms), *"Crowd Distracted"* (Skill: Empathy)

### Consequence Aspects
Aspects representing harm or fallout. Tag with severity.
- Physical injury, mental trauma, system damage, social fallout, reputation hits
- Format: *"Aspect Name"* [Mild/Moderate/Severe]
- Example: *"Cracked Faceplate"* [Mild], *"Shattered Trust"* [Moderate], *"Ego Fragmentation"* [Severe]

### Effect Aspects (Spin)
Aspects created from succeeding with Spin (3+ shifts). Bonus reward aspects.
- Dramatic advantages, momentum shifts, revealed weaknesses
- Example: *"Their Formation is Breaking"*, *"I Know Your Tell"*

### Character/NPC Aspects
Aspects that describe a person's current state, trait, or situation.
- Identity, motivation, vulnerability, relationship
- Example: *"Echo of Myself"*, *"Loyalty Has a Price Tag"*, *"No Innocents Here"*

### Equipment/Tech Aspects
Aspects on gear, augmentations, sleeves, drones, or tech.
- Weapon quirks, armor features, augmentation side effects, tech advantages
- Example: *"Military-Grade Optics"*, *"Overclocked but Unstable"*

### Persistent Aspects (P)
Major environmental or physical truths that persist and don't cost FP to invoke/compel for +2/-2.
- Extreme conditions, severe consequences, overwhelming forces
- Example: *"Zero Gravity(P)"*, *"Total Darkness(P)"*, *"Unmeshed(P)"*

### Zone Aspects
Aspects tied to specific zones in a conflict. One per zone.
- What makes this zone tactically or narratively distinct
- Example: Zone: Cargo Bay → *"Crates for Cover"*, Zone: Airlock → *"One Button Away from Vacuum"*

## Response Format

Use this compact table format for each category. Skip categories that don't apply.

```
## [Category Name]

| Aspect | Invoke | Compel |
|--------|--------|--------|
| "Aspect Name" | +2 when... | -2 when... |
```

For Maneuver Aspects, add a Skill column. For Consequences, add a Severity column.

Keep each cell SHORT — sentence fragments, not full sentences. The table must be scannable in under 5 seconds per category.

Separate categories with a blank line and `---` divider.

## Output Constraints

- 2-6 words per Aspect (punchy, memorable at the table)
- Every Aspect MUST be double-edged
- Nova Praxis vocabulary: mesh, sleeve, ego, fork, CID, House names, Apotheosis, SINC, mnemonic, etc.
- Draw from vault lore using CLI: `obsidian read file="[Faction/Location/Term]"` and `obsidian backlinks file="[subject]"` for connected context
- If the subject is an NPC, read their entity card: `obsidian read file="[NPC Name]"` (wikilink resolution finds it regardless of rank folder)
- Total: 15-25 Aspects across all relevant categories
- No generic fantasy tropes — hard sci-fi transhumanism only
- Do NOT use long prose descriptions — tables only
- After displaying aspects, if an active scene doc exists in the current session, offer to save them: `obsidian append file="[scene doc]" content="[aspects]" silent`. If no active scene doc, display only.
