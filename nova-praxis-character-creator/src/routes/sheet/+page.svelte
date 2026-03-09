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
                    Assets: <strong>{c.skills['assets'] ?? 0}</strong>
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

        <!-- MAIN CONTENT + SIDEBAR GRID -->
        <div class="p1-body">
            <div class="p1-main">

                <!-- SKILLS -->
                <div class="section">
                    <div class="section-header">Skills</div>
                    {#each [5, 4, 3, 2, 1] as rank}
                        {#if Object.entries(c.skills).some(([, v]) => v === rank)}
                            <div class="skill-rank-row">
                                <span class="rank-label">{rank}:</span>
                                <span class="rank-skills">
                                    {#each Object.entries(c.skills).filter(([, v]) => v === rank) as [name]}
                                        <span class="skill-pill">{name.replace(/_/g, ' ')}</span>
                                    {/each}
                                </span>
                            </div>
                        {/if}
                    {/each}
                </div>

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
                        <div class="stunt-row"><strong>{stunt}</strong></div>
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

            </div><!-- /p1-main -->

            <!-- SIDEBAR: stress tracks -->
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
        </div><!-- /p1-body -->
    </div>
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
        padding: 0px 4px;
        margin: 1px 1px;
        font-size: 8pt;
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

    /* ── Body grid ── */
    .p1-body {
        display: grid;
        grid-template-columns: 1fr 220px;
        gap: 0.75rem;
    }
    .section { margin-bottom: 0.5rem; }
    .skill-rank-row { display: flex; align-items: baseline; gap: 0.3rem; margin: 1px 0; font-size: 8pt; }
    .rank-label { font-weight: 700; min-width: 14px; color: #333; }
    .rank-skills { flex: 1; }

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
        width: 220px;
        height: 220px;
        object-fit: cover;
        object-position: top;
        border: 1.5px solid #ccc;
    }
    .portrait-placeholder {
        width: 220px;
        height: 220px;
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

    /* ── Page 2 ── */
    .p2-title { font-size: 16pt; margin-bottom: 0.3rem; }
    .p2-top { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.4rem 0; }
    .p2-bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 0.4rem 0; }
    .gear-row { font-size: 9.5pt; line-height: 1.6; }
    .gear-qty { font-size: 8.5pt; color: #666; margin-left: 4px; }
    .empty-note { font-size: 9pt; color: #888; font-style: italic; margin-top: 4px; }
    .notes-space { min-height: 2.5in; }

    /* ── Stunts + state ── */
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

    /* ── Sidebar stress tracks ── */
    .p1-sidebar { font-size: 8pt; }
    .stress-track { margin-bottom: 10px; }
    .stress-track-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
    }
    .stress-label { font-weight: 700; font-size: 9pt; }
    .stress-boxes { display: flex; align-items: center; gap: 2px; }
    .consequence-row {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        margin: 0 0 6px 0;
        min-height: 28px;
    }
    .con-label { color: #555; white-space: nowrap; min-width: 80px; line-height: 1; padding-bottom: 2px; }
    .con-line {
        flex: 1;
        border-bottom: 1px solid #999;
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
