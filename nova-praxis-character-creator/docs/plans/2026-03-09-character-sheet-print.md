# Character Sheet Print View — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/sheet` route to the SvelteKit character creator that renders a print-ready 2-page landscape character sheet matching the existing Nova Praxis PDF style, printable to PDF via the browser.

**Architecture:** New `src/routes/sheet/+page.svelte` reads from the existing Svelte character store and renders two landscape-page divs. `@media print` CSS hides all non-sheet UI and formats for letter landscape. A JSON loader on the main page lets you pre-populate the store without completing the wizard.

**Tech Stack:** SvelteKit 2, Svelte 4, TypeScript, Vite, CSS @media print — no new dependencies.

---

## Task 1: Copy Portrait Assets

**Files:**
- Create: `static/portraits/` (directory)
- Copy: `_Assets/PlayerPics/*.png` → `static/portraits/`

**Step 1: Copy the files**

```bash
cd nova-praxis-character-creator
mkdir -p static/portraits
cp "../_Assets/PlayerPics/Grace.png" static/portraits/
cp "../_Assets/PlayerPics/Azaria-Dawson.png" static/portraits/
cp "../_Assets/PlayerPics/Dustin.png" static/portraits/
cp "../_Assets/PlayerPics/Kallius.png" static/portraits/
```

**Step 2: Verify**

```bash
ls static/portraits/
```
Expected: 4 PNG files listed.

**Step 3: Commit**

```bash
git add static/portraits/
git commit -m "feat: add player portrait assets"
```

---

## Task 2: Update Character Store

**Files:**
- Modify: `src/lib/stores/character.ts`

Add two fields to the `Character` interface and default values.

**Step 1: Add fields to the `Character` interface**

In `character.ts`, after `playerName: string;` add:
```ts
portrait: string | null;        // filename from /portraits/, e.g. "Grace.png"
savantAspect: string;           // aspect text when Savant stunt is taken
```

**Step 2: Add defaults in `defaultCharacter`**

```ts
portrait: null,
savantAspect: '',
```

**Step 3: Add store helper methods** (inside `createCharacterStore`, after existing helpers)

```ts
setPortrait: (filename: string | null) => {
    update(char => ({ ...char, portrait: filename }));
},
setSavantAspect: (value: string) => {
    update(char => ({ ...char, savantAspect: value }));
},
```

**Step 4: Type-check**

```bash
npm run check
```
Expected: No errors.

**Step 5: Commit**

```bash
git add src/lib/stores/character.ts
git commit -m "feat: add portrait and savantAspect fields to character store"
```

---

## Task 3: Character JSON Loader

**Files:**
- Modify: `src/routes/+page.svelte`
- Create: `src/lib/components/CharacterLoader.svelte`

This lets you paste a full character JSON to populate the store — bypasses the incomplete wizard for now.

**Step 1: Create `CharacterLoader.svelte`**

```svelte
<script lang="ts">
    import { character } from '$lib/stores/character';

    let open = false;
    let jsonText = '';
    let error = '';

    function load() {
        error = '';
        try {
            const parsed = JSON.parse(jsonText);
            character.set(parsed);
            jsonText = '';
            open = false;
        } catch (e) {
            error = 'Invalid JSON — check the format and try again.';
        }
    }

    function exportCurrent() {
        let current: any;
        character.subscribe(c => current = c)();
        jsonText = JSON.stringify(current, null, 2);
    }
</script>

<div class="loader">
    <button class="secondary toggle" on:click={() => open = !open}>
        {open ? 'Hide' : 'Load / Export'} Character JSON
    </button>

    {#if open}
        <div class="loader-body">
            <p class="help">Paste a character JSON below to load it, or click Export to copy the current character.</p>
            <textarea bind:value={jsonText} rows={12} placeholder='{ "name": "...", ... }'></textarea>
            {#if error}<p class="error">{error}</p>{/if}
            <div class="loader-actions">
                <button on:click={exportCurrent}>Export Current</button>
                <button on:click={load} disabled={!jsonText.trim()}>Load</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .loader { margin-bottom: 1.5rem; }
    .toggle { font-size: 0.875rem; padding: 0.5rem 1rem; }
    .loader-body { margin-top: 1rem; background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .help { font-size: 0.875rem; color: #666; margin-bottom: 0.75rem; }
    textarea { font-family: monospace; font-size: 0.8rem; resize: vertical; }
    .loader-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; justify-content: flex-end; }
    .loader-actions button { flex: none; padding: 0.5rem 1rem; font-size: 0.875rem; }
</style>
```

**Step 2: Add to `+page.svelte`**

Import and place `<CharacterLoader />` at the top of the main content, before the progress bar:

```svelte
import CharacterLoader from '$lib/components/CharacterLoader.svelte';
```

And in the template, before `.character-creator`:
```svelte
<div class="page-header">
    <CharacterLoader />
    <a href="/sheet" target="_blank">
        <button class="secondary">Print Sheet</button>
    </a>
</div>
```

Add to `+page.svelte` styles:
```css
.page-header {
    max-width: 1200px;
    margin: 1rem auto 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
```

**Step 3: Type-check**

```bash
npm run check
```
Expected: No errors.

**Step 4: Visual check**

```bash
npm run dev
```
Open http://localhost:5173. You should see the Load/Export toggle and Print Sheet button above the wizard. Expand the loader, click Export — should show JSON of the empty default character.

**Step 5: Commit**

```bash
git add src/lib/components/CharacterLoader.svelte src/routes/+page.svelte
git commit -m "feat: add character JSON loader and Print Sheet link"
```

---

## Task 4: Sheet Route — Skeleton + Print CSS

**Files:**
- Create: `src/routes/sheet/+page.svelte`

Establish the two-page structure and all print CSS. No real content yet — just the shells.

**Step 1: Create the file**

```svelte
<script lang="ts">
    import { character } from '$lib/stores/character';
    import type { Character } from '$lib/stores/character';

    let c: Character;
    character.subscribe(v => c = v);

    function print() { window.print(); }
</script>

<svelte:head>
    <title>{c?.name || 'Character'} — Sheet</title>
</svelte:head>

<div class="screen-controls">
    <a href="/">← Back to Creator</a>
    <button on:click={print}>Print / Save as PDF</button>
</div>

<div class="sheet-wrap">
    <div class="sheet sheet-page-1">
        <p style="color:#999">Page 1 — coming in next tasks</p>
    </div>
    <div class="sheet sheet-page-2">
        <p style="color:#999">Page 2 — coming in next tasks</p>
    </div>
</div>

<style>
    /* ── Screen controls ── */
    .screen-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }
    .screen-controls a { color: #0f3460; text-decoration: none; font-weight: 600; }

    /* ── Sheet wrapper (screen preview) ── */
    .sheet-wrap {
        padding: 2rem;
        background: #ccc;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    /* ── Sheet page (both screen + print) ── */
    .sheet {
        width: 11in;
        min-height: 8.5in;
        background: white;
        padding: 0.5in;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 10pt;
        color: #222;
        position: relative;
    }

    /* ── Print media ── */
    @media print {
        .screen-controls { display: none !important; }
        .sheet-wrap {
            padding: 0;
            background: white;
            gap: 0;
        }
        .sheet {
            width: 100%;
            min-height: 0;
            padding: 0.5in;
            box-shadow: none;
            page-break-after: always;
        }
        .sheet:last-child { page-break-after: avoid; }
    }

    /* ── Sheet design tokens ── */
    :global(.sheet) {
        --navy: #1a2e5a;
        --blue: #2855a0;
        --teal: #1a7a6e;
        --rule: 1px solid #2855a0;
        --pill-bg: #eef0f8;
    }

    /* ── Section headers ── */
    :global(.sheet .section-header) {
        color: var(--blue);
        font-weight: 700;
        font-size: 11pt;
        border-bottom: var(--rule);
        padding-bottom: 2px;
        margin-bottom: 4px;
    }

    /* ── Stress boxes ── */
    :global(.sheet .stress-box) {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1.5px solid #333;
        margin-right: 2px;
        vertical-align: middle;
    }

    /* ── Skill pills ── */
    :global(.sheet .skill-pill) {
        display: inline-block;
        background: var(--pill-bg);
        border: 1px solid #c8cce8;
        border-radius: 3px;
        padding: 1px 6px;
        margin: 1px 2px;
        font-size: 9.5pt;
    }

    /* ── Gear / type badges ── */
    :global(.sheet .gear-tag) {
        display: inline-block;
        background: #1a7a6e;
        color: white;
        font-size: 7.5pt;
        font-weight: 700;
        border-radius: 2px;
        padding: 0 4px;
        margin-left: 4px;
        vertical-align: middle;
        letter-spacing: 0.03em;
    }

    /* ── AR badge ── */
    :global(.sheet .ar-badge) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid var(--teal);
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 8.5pt;
        font-weight: 700;
        color: var(--teal);
    }
</style>
```

**Step 2: Type-check**

```bash
npm run check
```
Expected: No errors.

**Step 3: Visual check**

```bash
npm run dev
```
Navigate to http://localhost:5173/sheet — should see grey background with two white page-sized boxes and the screen controls bar.

**Step 4: Commit**

```bash
git add src/routes/sheet/+page.svelte
git commit -m "feat: add /sheet route skeleton with print CSS"
```

---

## Task 5: Page 1 — Header (Name + Aspects + FP Tracker + Portrait)

**Files:**
- Modify: `src/routes/sheet/+page.svelte`

Replace the `sheet-page-1` placeholder with the real header section.

**Step 1: Replace page 1 content with header layout**

Replace `<div class="sheet sheet-page-1">` content with:

```svelte
<div class="sheet sheet-page-1">
    <!-- HEADER ROW -->
    <div class="p1-header">
        <div class="p1-aspects">
            <div class="p1-name-row">
                <h1 class="char-name">{c.name || 'Character Name'}</h1>
                <span class="high-concept">{c.aspects.ambition || ''}</span>
            </div>
            <div class="aspect-list">
                {#each [
                    ['AMBITION', c.aspects.ambition],
                    ['BELIEF', c.aspects.belief],
                    ['CONNECTION', c.aspects.connection],
                    ['DISADVANTAGE', c.aspects.disadvantage],
                    ['EXPERTISE', c.aspects.expertise],
                    ...(c.savantAspect ? [['SAVANT', c.savantAspect]] : [])
                ] as [label, value]}
                    <div class="aspect-row">
                        <span class="aspect-label">{label}:</span>
                        <span class="aspect-value">{value || '—'}</span>
                    </div>
                {/each}
            </div>
        </div>

        <div class="p1-fp-block">
            <FpTracker refresh={c.refresh} />
            <div class="bumps-assets">
                Bumps: <strong>{c.repRating ?? 0}</strong>
                &nbsp;&nbsp;Assets: <strong>{c.skills['assets'] ?? 0}</strong>
            </div>
        </div>

        <div class="p1-portrait">
            {#if c.portrait}
                <img src="/portraits/{c.portrait}" alt="{c.name} portrait" />
            {:else}
                <div class="portrait-placeholder">No portrait</div>
            {/if}
        </div>
    </div>

    <hr class="sheet-rule" />
    <!-- remainder of page 1 goes here in later tasks -->
</div>
```

**Step 2: Add the FpTracker as an inline component** (in the `<script>` block)

```svelte
<script lang="ts">
    // ... existing imports ...

    function fpSegments(refresh: number) {
        // Returns SVG arc path data for N equal wedge segments in a circle
        const cx = 40, cy = 40, r = 34, gap = 3;
        const segments = [];
        for (let i = 0; i < refresh; i++) {
            const startAngle = (i / refresh) * 2 * Math.PI - Math.PI / 2 + (gap / (2 * r));
            const endAngle = ((i + 1) / refresh) * 2 * Math.PI - Math.PI / 2 - (gap / (2 * r));
            const x1 = cx + r * Math.cos(startAngle);
            const y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(endAngle);
            const y2 = cy + r * Math.sin(endAngle);
            const large = endAngle - startAngle > Math.PI ? 1 : 0;
            segments.push(`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`);
        }
        return segments;
    }
</script>
```

And the FpTracker markup (inline SVG, before the `</div>` of p1-fp-block):

```svelte
<!-- FP Tracker SVG (replace <FpTracker /> call above with this inline block) -->
<svg class="fp-wheel" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    {#each fpSegments(c.refresh) as d}
        <path {d} fill="none" stroke="#2855a0" stroke-width="1.5" />
    {/each}
    <text x="40" y="45" text-anchor="middle" font-size="20" font-weight="700" fill="#1a2e5a">
        {c.refresh}
    </text>
</svg>
```

(Remove the `<FpTracker>` component reference — use inline SVG directly.)

**Step 3: Add header styles** (inside `<style>`)

```css
/* Header */
.p1-header {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
}
.char-name {
    font-size: 22pt;
    font-weight: 900;
    color: var(--navy);
    letter-spacing: -0.02em;
    line-height: 1;
}
.high-concept {
    font-style: italic;
    font-size: 12pt;
    color: #444;
    margin-left: 1rem;
    align-self: flex-end;
}
.p1-name-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
    border-bottom: var(--rule);
    padding-bottom: 4px;
}
.aspect-row { display: flex; gap: 0.4rem; line-height: 1.55; }
.aspect-label { font-weight: 700; color: var(--blue); font-size: 9pt; min-width: 90px; }
.aspect-value { font-size: 9.5pt; }
.fp-wheel { width: 80px; height: 80px; }
.bumps-assets { font-size: 8.5pt; text-align: center; margin-top: 4px; color: #555; }
.p1-portrait img {
    width: 130px;
    height: 140px;
    object-fit: cover;
    border: 1.5px solid #ccc;
}
.portrait-placeholder {
    width: 130px;
    height: 140px;
    border: 1.5px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8pt;
    color: #aaa;
}
.sheet-rule {
    border: none;
    border-top: var(--rule);
    margin: 6px 0;
}
```

**Step 4: Type-check + visual check**

```bash
npm run check
npm run dev
```

Load a character JSON with a portrait field (e.g. `"portrait": "Grace.png"`) using the loader. Navigate to `/sheet` — you should see the header with name, aspects, FP wheel, and portrait.

**Step 5: Commit**

```bash
git add src/routes/sheet/+page.svelte
git commit -m "feat: sheet page 1 header — name, aspects, FP wheel, portrait"
```

---

## Task 6: Page 1 — Allegiance + Skills

**Files:**
- Modify: `src/routes/sheet/+page.svelte`

Add the Allegiance and Skills sections below the header rule.

**Step 1: Add Allegiance + Skills markup** after `<hr class="sheet-rule" />` in page 1:

```svelte
<!-- MAIN CONTENT + SIDEBAR GRID -->
<div class="p1-body">
    <div class="p1-main">

        <!-- ALLEGIANCE -->
        <div class="section">
            <div class="section-header">Allegiance</div>
            <table class="allegiance-table">
                <tr>
                    <td class="al-label">House</td>
                    <td>{c.houseAffiliation ?? '—'}</td>
                </tr>
                <tr>
                    <td class="al-label">Market</td>
                    <td>—</td>
                </tr>
                <tr>
                    <td class="al-label">Discount</td>
                    <td>—</td>
                </tr>
            </table>
        </div>

        <hr class="sheet-rule" />

        <!-- SKILLS -->
        <div class="section">
            <div class="section-header">Skills</div>
            {#each [5, 4, 3, 2, 1] as rank}
                {#if Object.entries(c.skills).some(([, v]) => v === rank)}
                    <div class="skill-rank-row">
                        <span class="rank-label">Rank {rank}:</span>
                        <span class="rank-skills">
                            {#each Object.entries(c.skills).filter(([, v]) => v === rank) as [name], i}
                                {#if rank >= 3}
                                    <span class="skill-pill">{name.replace(/_/g, ' ')}</span>
                                {:else}
                                    {#if i > 0}<span class="skill-sep"> · </span>{/if}
                                    {name.replace(/_/g, ' ')}
                                {/if}
                            {/each}
                        </span>
                    </div>
                {/if}
            {/each}
        </div>

    </div><!-- /p1-main -->

    <!-- SIDEBAR (stress tracks) — added in next task -->
    <div class="p1-sidebar">
        <p style="color:#aaa;font-size:8pt">Stress sidebar — next task</p>
    </div>
</div><!-- /p1-body -->
```

**Step 2: Add styles**

```css
.p1-body {
    display: grid;
    grid-template-columns: 1fr 160px;
    gap: 0.75rem;
}
.section { margin-bottom: 0.5rem; }
.allegiance-table { border-collapse: collapse; font-size: 9.5pt; width: 100%; }
.allegiance-table td { padding: 1px 8px 1px 0; vertical-align: top; }
.al-label { font-weight: 700; color: #333; width: 70px; }
.skill-rank-row { display: flex; align-items: baseline; gap: 0.4rem; margin: 2px 0; font-size: 9.5pt; }
.rank-label { font-weight: 700; min-width: 52px; color: #333; }
.rank-skills { flex: 1; }
.skill-sep { color: #888; }
```

**Step 3: Type-check + visual check**

```bash
npm run check && npm run dev
```

Load Grace's JSON. Skills should appear grouped by rank, pills at rank 3+, inline at rank 1–2.

**Step 4: Commit**

```bash
git add src/routes/sheet/+page.svelte
git commit -m "feat: sheet page 1 allegiance and skills sections"
```

---

## Task 7: Page 1 — Stunts + Stress Sidebar

**Files:**
- Modify: `src/routes/sheet/+page.svelte`

Add the stunts section and wire up the right-side stress tracks.

**Step 1: Add Stunts section** after the skills `<hr class="sheet-rule" />`:

```svelte
<hr class="sheet-rule" />

<!-- STUNTS -->
<div class="section">
    <div class="stunts-header-row">
        <span class="section-header" style="border:none;padding:0;margin:0">Stunts:</span>
        <span class="fp-row">
            Fate Points:
            {#each Array(c.refresh) as _}
                <span class="stress-box"></span>
            {/each}
            &nbsp;&nbsp;Refresh: <strong>{c.refresh}</strong>
        </span>
    </div>
    {#each c.stunts as stunt}
        <div class="stunt-row">
            <strong>{stunt}</strong>
        </div>
    {/each}
    {#if c.stunts.length === 0}
        <div class="stunt-row" style="color:#aaa">No stunts recorded</div>
    {/if}
</div>

<hr class="sheet-rule" />

<!-- STATE + AUGMENTATIONS -->
<div class="state-aug-row">
    <div class="state-block">
        <div class="section-header">State: {c.characterState?.toUpperCase() ?? '—'}</div>
        <div class="state-detail">
            <strong>Physical Skills ({c.characterState?.toUpperCase()}):</strong><br/>
            Athletics {c.physicalSkills.athletics},
            Endurance {c.physicalSkills.endurance},
            Perception {c.physicalSkills.perception}
        </div>
    </div>
    <div class="aug-block">
        <div class="section-header">Augmentations:</div>
        {#if c.sleeve?.augmentations?.length}
            {#each c.sleeve.augmentations as aug}
                <div class="aug-row">{aug}</div>
            {/each}
        {:else}
            <div style="color:#aaa;font-size:8.5pt">None</div>
        {/if}
    </div>
</div>
```

**Step 2: Replace the sidebar placeholder** with real stress tracks:

```svelte
<div class="p1-sidebar">
    {#each [
        { label: 'Mental', boxes: c.mentalStress, ar: null },
        { label: 'Physical', boxes: c.physicalStress, ar: c.sleeve?.type === 'cybersleeve' ? 1 : null },
        ...(c.characterState === 'sim' ? [{ label: 'System', boxes: 5, ar: null }] : [])
    ] as track}
        <div class="stress-track">
            <div class="stress-track-header">
                <span class="stress-label">{track.label}</span>
                <span class="stress-boxes">
                    {#each Array(track.boxes) as _}
                        <span class="stress-box"></span>
                    {/each}
                    {#if track.ar}
                        <span class="ar-badge">AR +{track.ar}</span>
                    {/if}
                </span>
            </div>
            {#each [['Mild', '−2'], ['Moderate', '−4'], ['Severe(P)', '−6'], ['Extreme(P)', '−8']] as [name, val]}
                <div class="consequence-row">
                    <span class="con-label">{name} ({val})</span>
                    <span class="con-line"></span>
                </div>
            {/each}
        </div>
    {/each}
</div>
```

**Step 3: Add styles**

```css
.stunts-header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
}
.fp-row { font-size: 9pt; }
.stunt-row { font-size: 9pt; line-height: 1.5; margin: 1px 0; }
.state-aug-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 9pt; }
.state-detail { margin-top: 3px; }
.aug-row { font-size: 9pt; line-height: 1.5; }

/* Sidebar stress tracks */
.p1-sidebar { font-size: 8.5pt; }
.stress-track { margin-bottom: 8px; }
.stress-track-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
}
.stress-label { font-weight: 700; font-size: 9.5pt; }
.stress-boxes { display: flex; align-items: center; gap: 2px; }
.consequence-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin: 2px 0;
}
.con-label { color: #555; white-space: nowrap; min-width: 88px; }
.con-line {
    flex: 1;
    border-bottom: 1px solid #999;
    margin-bottom: 2px;
}
```

**Step 4: Type-check + visual check**

```bash
npm run check && npm run dev
```

Load Grace's JSON. Stunts, FP boxes, stress tracks with consequence lines should all appear. For a SIM character, System track should show.

**Step 5: Commit**

```bash
git add src/routes/sheet/+page.svelte
git commit -m "feat: sheet page 1 stunts, stress tracks, state/augmentations"
```

---

## Task 8: Page 2 — Gear, Drones, Allies, Notes

**Files:**
- Modify: `src/routes/sheet/+page.svelte`

Replace the page 2 placeholder with the full layout.

**Step 1: Replace page 2 content**

```svelte
<div class="sheet sheet-page-2">
    <!-- Page 2 header -->
    <h1 class="char-name p2-title">{c.name || 'Character'} — Page 2</h1>
    <hr class="sheet-rule" />

    <!-- GEAR + ALLIES row -->
    <div class="p2-top">
        <div class="p2-gear">
            <div class="section-header">Gear</div>
            {#if c.gear.length}
                {#each c.gear as item}
                    <div class="gear-row">
                        <strong>{item.name}</strong>
                        <span class="gear-tag">{item.type.toUpperCase()}</span>
                        {#if item.quantity > 1}
                            <span class="gear-qty">×{item.quantity}</span>
                        {/if}
                    </div>
                {/each}
            {:else}
                <p class="empty-note">No gear recorded</p>
            {/if}
        </div>
        <div class="p2-allies">
            <div class="section-header">Allies &amp; Contacts</div>
            <p class="empty-note"><em>No allies recorded — use this space to track important contacts, allies, and relationships.</em></p>
        </div>
    </div>

    <hr class="sheet-rule" />

    <!-- DRONES + VEHICLES row -->
    <div class="p2-bottom-row">
        <div class="p2-drones">
            <div class="section-header">Drones</div>
            <p class="empty-note"><em>No drones recorded</em></p>
        </div>
        <div class="p2-vehicles">
            <div class="section-header">Vehicles</div>
            <p class="empty-note"><em>No vehicles recorded</em></p>
        </div>
    </div>

    <hr class="sheet-rule" />

    <!-- NOTES -->
    <div class="p2-notes">
        <div class="section-header">Notes</div>
        <div class="notes-space"></div>
    </div>
</div>
```

**Step 2: Add page 2 styles**

```css
.p2-title { font-size: 16pt; margin-bottom: 0.3rem; }
.p2-top { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.4rem 0; }
.p2-bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.4rem 0; }
.gear-row { font-size: 9.5pt; line-height: 1.6; }
.gear-qty { font-size: 8.5pt; color: #666; margin-left: 4px; }
.empty-note { font-size: 9pt; color: #888; font-style: italic; margin-top: 4px; }
.notes-space { min-height: 2.5in; }
```

**Step 3: Type-check + visual check**

```bash
npm run check && npm run dev
```

Navigate to `/sheet`. Page 2 should show the two-column gear/allies layout, drones/vehicles, and a notes area.

**Step 4: Commit**

```bash
git add src/routes/sheet/+page.svelte
git commit -m "feat: sheet page 2 gear, allies, drones, vehicles, notes"
```

---

## Task 9: Print Verification + Polish

**Files:**
- Modify: `src/routes/sheet/+page.svelte` (minor tweaks only)

**Step 1: Load Grace's full character JSON**

Use the CharacterLoader on the main page. Full JSON (copy from the reference sheet data):

```json
{
  "name": "Grace Pryzbilski",
  "playerName": "Sara",
  "portrait": "Grace.png",
  "aspects": {
    "ambition": "Protect my friends at any cost",
    "belief": "Always Observing, Never Observed",
    "connection": "Kalius' Personal Ward",
    "disadvantage": "Thin Skinned and Traumatized",
    "expertise": "Dance, Puppets!"
  },
  "savantAspect": "Scopophobia",
  "characterState": "sim",
  "houseAffiliation": "House Kimura",
  "skills": {
    "engineering_hardware": 5,
    "research": 5,
    "education": 4,
    "engineering_software": 4,
    "sinc": 3,
    "stealth": 3,
    "guile": 2,
    "insight": 2,
    "diplomacy": 1,
    "intimidation": 1,
    "mnemonics": 1,
    "house_networking": 1,
    "pilot": 1,
    "resolve": 1
  },
  "physicalSkills": { "athletics": 2, "endurance": 1, "perception": 4 },
  "skillDistribution": "specialist",
  "repRating": 6,
  "stunts": ["Savant", "System Slip", "Skilled (SINC)", "Puppeteer (Savant Program, Simple Action)"],
  "savantPrograms": ["Puppeteer"],
  "sleeve": {
    "type": null,
    "variant": null,
    "augmentations": ["Adrenal Boost Module", "Beholder Sensory Suite"]
  },
  "gear": [
    { "name": "Light Rail-Pistol", "type": "VIRT", "quantity": 1 },
    { "name": "Reinforced Clothing/Protective Vest", "type": "TMPL", "quantity": 1 }
  ],
  "refresh": 5,
  "physicalStress": 4,
  "mentalStress": 3,
  "portrait": "Grace.png"
}
```

**Step 2: Print preview check**

In Chrome/Edge: Open `/sheet` → Ctrl+P → change layout to Landscape, paper to Letter. Verify:
- [ ] Page 1 fits on one landscape letter page
- [ ] Page 2 starts on a new page
- [ ] No content is clipped at edges
- [ ] Portrait image appears
- [ ] Screen controls are hidden in print preview
- [ ] Stress tracks and consequence lines are visible
- [ ] Skills appear grouped by rank with pills at rank 3+

**Step 3: Fix any overflow issues**

If content overflows page 1, reduce font sizes or section margins slightly. Target: everything fits in `8.5in × 11in` at 0.5in margins on all sides.

**Step 4: Final type-check**

```bash
npm run check
```
Expected: No errors.

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: character sheet print view complete — 2-page landscape PDF ready"
```

---

## Done

At this point:
- `/sheet` renders a 2-page landscape character sheet from store data
- Portraits load from `static/portraits/`
- JSON loader lets you populate any character without completing the wizard
- Browser Ctrl+P → Save as PDF → laminate-ready output
