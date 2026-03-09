# Character Sheet Print View — Design Doc
_2026-03-09_

## Goal

Add a printable, PDF-ready character sheet to the existing SvelteKit character creator app. Players complete (or load) their character, click Print Sheet, and get a browser print dialog they save as PDF. Output is laminate-ready, 8.5×11 landscape, two pages.

## Reference

Grace Pryzbilski's existing PDF sheet — white background, dark navy headings, steel-blue section labels, thin blue horizontal rules, right sidebar for stress tracks.

## Scope

- New `/sheet` route rendering two landscape pages from the character store
- Portrait support (static assets + store field)
- Character JSON loader to populate the store without completing the full wizard
- Print button wired up

Explicitly out of scope: completing the wizard steps, drones/vehicles/allies data model (sections render with placeholder text this iteration).

---

## What We're Building

### 1. Portrait Assets

Copy `_Assets/PlayerPics/*.png` → `static/portraits/`. Add `portrait: string | null` field to the character store. Portrait picker: dropdown of available filenames + "None" option.

Available portraits: `Grace.png`, `Azaria-Dawson.png`, `Dustin.png`, `Kallius.png`

### 2. Character Store Addition

Add to `Character` interface:
```ts
portrait: string | null;        // filename from static/portraits/
savantAspect: string;           // separate from stunts array
```

### 3. Character JSON Loader

Simple textarea on the main page (collapsible). Paste valid character JSON → populates store. Enables printing without wizard being complete. Presets for existing PCs (Grace, Azaria, Dustin, Kallius) optional nice-to-have.

### 4. `/sheet` Route — Two-Page Layout

**Page 1 — `sheet-page-1`**

```
┌─────────────────────────────────────────────────┬──────────┐
│ NAME (large bold navy)    High Concept (italic)  │ PORTRAIT │
│ AMBITION: ...                    [FP tracker]    │  photo   │
│ BELIEF: ...                                      │          │
│ CONNECTION: ...                                  └──────────┤
│ DISADVANTAGE: ...                                           │
│ EXPERTISE: ...          Bumps: N  Assets: N                 │
├─────────────────────────────────────────────────────────────┤
│ Allegiance                                  │ Mental  □□□  │
│ House / Market / Discount                   │ Mild (-2) _  │
├─────────────────────────────────────────────┤ Mod (-4)  _  │
│ Skills                                      │ Sev (-6)  _  │
│ Rank 5: Skill · Skill                       │ Ext (-8)  _  │
│ Rank 4: Skill · Skill                       ├──────────────┤
│ Rank 3: Skill · Skill                       │ Physical □□□□│
│ Rank 2: Skill · Skill                       │ (AR +N)      │
│ Rank 1: Skill · Skill · Skill               │ consequences │
├─────────────────────────────────────────────┤──────────────┤
│ Stunts:              Fate Points: □□□□  Refresh: N         │
│ Stunt Name — description                    │ System □□□□□ │
│ Stunt Name — description                    │ consequences │
├─────────────────────────────────────────────┴──────────────┤
│ State: X          │ Augmentations:                         │
│ Physical Skills   │ Aug Name [tier]                        │
│ Agent: Name       │ Aug Name [tier]                        │
└───────────────────┴────────────────────────────────────────┘
```

**Page 2 — `sheet-page-2`**

```
┌─────────────────────────────────────────────────────────────┐
│ NAME — Page 2                                               │
├──────────────────────────┬──────────────────────────────────┤
│ Gear                     │ Allies & Contacts                │
│ Item [TAG] (stats)       │ (placeholder if empty)          │
├──────────────────────────┼──────────────────────────────────┤
│ Drones                   │ Vehicles                        │
│ (placeholder)            │ (placeholder)                   │
├──────────────────────────┴──────────────────────────────────┤
│ Notes                                                       │
│ (blank space)                                               │
└─────────────────────────────────────────────────────────────┘
```

### 5. Visual Style

| Element | Value |
|---------|-------|
| Page size | `@page { size: letter landscape; margin: 0.5in; }` |
| Background | White |
| Name font | Bold, condensed sans-serif, dark navy `#1a2e5a` |
| Section headers | Steel blue `#2855a0`, bold, small caps |
| Rules | `1px solid #2855a0`, full width |
| Body font | Clean sans-serif, 10–11pt |
| Skill pills | Light gray background `#eef`, border-radius 3px, rank 3+ |
| Gear tags | Teal badge `[VIRT]`, `[TMPL]`, `[B]`, `[C]` |
| Stress boxes | `□` Unicode or inline bordered spans, ~18px |
| AR badge | Circled, teal/steel accent |
| FP tracker | Circular SVG pie segments, number centered |

### 6. Print Trigger

- "Print Sheet" button on `StepFinalize` (or wherever the wizard ends) → `href="/sheet"` in new tab
- "Print" button on the sheet page itself → `window.print()`
- `@media print`: hide all nav, buttons, and non-sheet elements; show only `.sheet-page-1` and `.sheet-page-2`
- Each page div gets `page-break-after: always`

---

## Files Touched

| File | Change |
|------|--------|
| `src/lib/stores/character.ts` | Add `portrait`, `savantAspect` fields |
| `src/routes/+page.svelte` | Add JSON loader UI + Print Sheet button |
| `src/routes/sheet/+page.svelte` | New — two-page sheet layout |
| `src/app.css` | Add print media query, sheet page styles |
| `static/portraits/*.png` | Copy from `_Assets/PlayerPics/` |

---

## Out of Scope (This Iteration)

- Drones, vehicles, allies data model and wizard steps
- Completing missing wizard steps (StepHouse, StepSkills, etc.)
- Interactive/editable sheet fields
- Automated PDF generation (Puppeteer, etc.)
