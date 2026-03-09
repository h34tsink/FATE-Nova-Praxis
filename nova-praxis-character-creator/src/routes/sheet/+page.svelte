<script lang="ts">
    import { character } from '$lib/stores/character';
    import type { Character } from '$lib/stores/character';

    let c: Character;
    character.subscribe(v => c = v);

    function print() { window.print(); }

    function fpSegments(refresh: number) {
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

<svelte:head>
    <title>{c?.name || 'Character'} — Sheet</title>
</svelte:head>

<div class="screen-controls">
    <a href="/">← Back to Creator</a>
    <button on:click={print}>Print / Save as PDF</button>
</div>

<div class="sheet-wrap">
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
                <svg class="fp-wheel" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    {#each fpSegments(c.refresh) as d}
                        <path {d} fill="none" stroke="#2855a0" stroke-width="1.5" />
                    {/each}
                    <text x="40" y="45" text-anchor="middle" font-size="20" font-weight="700" fill="#1a2e5a">
                        {c.refresh}
                    </text>
                </svg>
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

    /* ── Header ── */
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
