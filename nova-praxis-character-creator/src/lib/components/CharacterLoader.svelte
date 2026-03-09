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
            <textarea bind:value={jsonText} rows={12} placeholder='Paste character JSON here...'></textarea>
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
