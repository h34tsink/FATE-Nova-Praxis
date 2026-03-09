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
