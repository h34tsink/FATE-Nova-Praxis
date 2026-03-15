# Share with Players Button — Implementation Plan

**Date:** 2026-03-15
**Spec:** `docs/superpowers/specs/2026-03-14-share-with-players-design.md`
**Depends on (parallel work):** `src/embeds/player-response.ts` (already exists with `stripGmContent()`), `rules.ts` and `recap.ts` gaining `isGM()` branching

---

## Step 1: Create the in-memory content cache

**File:** `nova-praxis-discord/src/share-cache.ts` (new)

```typescript
import { randomUUID } from 'node:crypto';

interface CachedContent {
  title: string;
  content: string;
  userId: string;
  timestamp: number;
}

const cache = new Map<string, CachedContent>();
const TTL_MS = 15 * 60 * 1000; // 15 minutes

export function cacheForShare(title: string, content: string, userId: string): string {
  const id = randomUUID();
  cache.set(id, { title, content, userId, timestamp: Date.now() });
  return `share_${id}`;
}

export function getSharedContent(customId: string): CachedContent | null {
  const id = customId.replace('share_', '');
  const entry = cache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(id);
    return null;
  }
  return entry;
}

export function consumeSharedContent(customId: string): CachedContent | null {
  const entry = getSharedContent(customId);
  if (entry) {
    cache.delete(customId.replace('share_', ''));
  }
  return entry;
}

// Sweep expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now - entry.timestamp > TTL_MS) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();
```

**Commit:** `feat(discord): add in-memory share content cache with 15min TTL`

---

## Step 2: Add button builder helper

**File:** `nova-praxis-discord/src/embeds/share-button.ts` (new)

```typescript
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';

export function shareButton(customId: string): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel('Share with Players')
      .setStyle(ButtonStyle.Primary)
  );
}

export function disabledShareButton(customId: string): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel('Shared')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}
```

**Commit:** `feat(discord): add Share with Players button builder`

---

## Step 3: Add button interaction handler in index.ts

**File:** `nova-praxis-discord/src/index.ts` (modify)

Add imports at top:

```typescript
import { MessageFlags } from 'discord.js';
import { consumeSharedContent } from './share-cache.js';
import { playerResponseEmbed } from './embeds/player-response.js';
import { disabledShareButton } from './embeds/share-button.js';
```

In the `InteractionCreate` handler, add a button branch **before** the `isChatInputCommand()` check:

```typescript
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isAutocomplete()) {
    await handleAutocomplete(interaction);
    return;
  }

  // --- NEW: Handle share button clicks ---
  if (interaction.isButton() && interaction.customId.startsWith('share_')) {
    try {
      const entry = consumeSharedContent(interaction.customId);
      if (!entry) {
        await interaction.reply({
          content: 'Content expired — run the command again.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (interaction.user.id !== entry.userId) {
        await interaction.reply({
          content: 'Only the GM who ran the command can share it.',
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Post public player-safe embed
      const embeds = playerResponseEmbed(entry.title, entry.content);
      await interaction.channel?.send({ embeds });

      // Disable the button on the ephemeral message
      await interaction.update({
        components: [disabledShareButton(interaction.customId)],
      });
    } catch (err) {
      console.error('Error handling share button:', err);
    }
    return;
  }
  // --- END NEW ---

  if (!interaction.isChatInputCommand()) return;

  // ... existing command dispatch ...
});
```

Note: `consumeSharedContent()` deletes the cache entry on read, so a second click on the same button (if somehow not disabled) returns the expired message. The `interaction.user.id` check prevents other users from clicking (though ephemeral messages are only visible to the sender anyway — belt and suspenders).

**Commit:** `feat(discord): handle Share with Players button interactions`

---

## Step 4: Wire buttons into each command

Each command needs three changes:
1. Make `deferReply` ephemeral (if not already)
2. Cache the raw content
3. Attach the button row to `editReply`

### 4a. scene.ts

**File:** `nova-praxis-discord/src/commands/scene.ts`

Add imports:

```typescript
import { MessageFlags } from 'discord.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

Change `deferReply`:

```typescript
await interaction.deferReply({ flags: MessageFlags.Ephemeral });
```

Change the success `editReply`:

```typescript
const result = await callClaude(prompt);
const customId = cacheForShare('Scene', result.output, interaction.user.id);
const embeds = gmResponseEmbed('Scene', result.output);
await interaction.editReply({ embeds, components: [shareButton(customId)] });
```

**Commit:** `feat(discord): add Share with Players button to /scene`

### 4b. aspects.ts

**File:** `nova-praxis-discord/src/commands/aspects.ts`

Same pattern as scene. Add imports, ephemeral defer, cache + button:

```typescript
import { MessageFlags } from 'discord.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

```typescript
await interaction.deferReply({ flags: MessageFlags.Ephemeral });
```

```typescript
const result = await callClaude(prompt);
const customId = cacheForShare('Aspects', result.output, interaction.user.id);
const embeds = gmResponseEmbed('Aspects', result.output);
await interaction.editReply({ embeds, components: [shareButton(customId)] });
```

**Commit:** `feat(discord): add Share with Players button to /aspects`

### 4c. npc.ts

**File:** `nova-praxis-discord/src/commands/npc.ts`

Already ephemeral. Add imports:

```typescript
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

Cache the **full** `result.output` (not just `gmNotes`). Add button to both the webhook-success and webhook-failure `editReply` paths:

```typescript
// After callClaude:
const customId = cacheForShare(`NPC: ${token}`, result.output, interaction.user.id);
```

Webhook-failure path (full embed):

```typescript
if (!webhookSent) {
  const embeds = gmResponseEmbed(`NPC: ${token}`, result.output);
  await interaction.editReply({ embeds, components: [shareButton(customId)] });
  return;
}
```

Webhook-success path (GM notes embed):

```typescript
if (gmNotes) {
  const embeds = gmResponseEmbed(`GM Notes: ${token}`, gmNotes);
  await interaction.editReply({ embeds, components: [shareButton(customId)] });
} else {
  await interaction.editReply({
    content: 'Dialogue sent.',
    components: [shareButton(customId)],
  });
}
```

**Commit:** `feat(discord): add Share with Players button to /npc`

### 4d. gm-start.ts

**File:** `nova-praxis-discord/src/commands/gm-start.ts`

Add imports:

```typescript
import { MessageFlags } from 'discord.js';
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

```typescript
await interaction.deferReply({ flags: MessageFlags.Ephemeral });
```

```typescript
const result = await callClaude(prompt, 120_000);
const customId = cacheForShare('Session Bootstrap', result.output, interaction.user.id);
const embeds = gmResponseEmbed('Session Bootstrap', result.output);
await interaction.editReply({ embeds, components: [shareButton(customId)] });
```

**Commit:** `feat(discord): add Share with Players button to /gm-start`

### 4e. rules.ts (GM branch only)

**File:** `nova-praxis-discord/src/commands/rules.ts`

The parallel agent is refactoring this to have `isGM()` branching. The GM branch will already use `deferReply({ flags: MessageFlags.Ephemeral })`. Add the share button to that branch only.

Add imports:

```typescript
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

In the GM fast-path:

```typescript
if (fastAnswer) {
  const customId = cacheForShare('Rules Lookup', fastAnswer, interaction.user.id);
  await interaction.reply({
    embeds: [rulesEmbed(answer, source)],
    flags: MessageFlags.Ephemeral,
    components: [shareButton(customId)],
  });
  return;
}
```

In the GM slow-path (Claude CLI):

```typescript
const result = await callClaude(fullPrompt);
const customId = cacheForShare('Rules', result.output, interaction.user.id);
const embeds = gmResponseEmbed('Rules', result.output);
await interaction.editReply({ embeds, components: [shareButton(customId)] });
```

The player branch (non-GM) should have no share button — it already posts a public response.

**Commit:** `feat(discord): add Share with Players button to /rules GM branch`

### 4f. recap.ts (GM branch only)

**File:** `nova-praxis-discord/src/commands/recap.ts`

Same situation as rules — parallel agent adding `isGM()` branching. Add to the GM branch only.

Add imports:

```typescript
import { cacheForShare } from '../share-cache.js';
import { shareButton } from '../embeds/share-button.js';
```

In the GM branch (which will already defer ephemeral):

```typescript
const result = await callClaude(prompt);
const customId = cacheForShare('Recap', result.output, interaction.user.id);
const embeds = gmResponseEmbed('Recap', result.output);
await interaction.editReply({ embeds, components: [shareButton(customId)] });
```

**Commit:** `feat(discord): add Share with Players button to /recap GM branch`

---

## Step 5: Verify player-response.ts integration

The existing `src/embeds/player-response.ts` already has:
- `stripGmContent()` — strips `**Confidence:**`, `**Hidden truth`, `**Intent:**`, `(GM-only)`, `**Pacing:**`, `**Exposure clock`, `**Next Beat:**`
- `playerResponseEmbed()` — builds blue (0x5865f2) embeds with "Powered by Claude" footer

The spec calls for a "Shared by GM" footer on shared embeds. Either:
- **Option A:** Add a `footer` parameter to `playerResponseEmbed(title, content, footer?)` defaulting to "Powered by Claude", pass "Shared by GM" from the button handler.
- **Option B:** Create a thin wrapper in the button handler that overrides the footer.

Recommended: Option A, one-line change.

In `player-response.ts`, change the signature:

```typescript
export function playerResponseEmbed(
  title: string,
  content: string,
  footer = 'Powered by Claude'
): EmbedBuilder[] {
```

And use `footer` variable instead of the hardcoded string in both `.setFooter()` calls.

In the button handler in `index.ts`:

```typescript
const embeds = playerResponseEmbed(entry.title, entry.content, 'Shared by GM');
```

**Commit:** `feat(discord): use "Shared by GM" footer for share button embeds`

---

## Step 6: Spec gap — Hidden aspects section stripping

The spec calls for stripping `### Scene Aspects (Hidden)` section blocks. The current `stripGmContent()` in `player-response.ts` uses line-level regex patterns but does **not** have the section-level regex for hidden aspect blocks. If Claude outputs `### Scene Aspects (Hidden)` as a section header followed by a table, the current line-level `(GM-only)` pattern won't catch the header or table rows.

Add to `GM_PATTERNS` in `player-response.ts`:

```typescript
// After the existing GM_PATTERNS array, add section-level stripping in stripGmContent:
result = result.replace(/###\s*Scene Aspects \(Hidden\)[\s\S]*?(?=###|$)/g, '');
```

This goes after the line-level `replace` loop but before the newline collapse. Insert it at line ~22 in the existing function, between the for loop and the `\n{3,}` replace.

**Commit:** `fix(discord): strip hidden aspect sections in player share content`

---

## Commit sequence

| # | Commit message | Files |
|---|---------------|-------|
| 1 | `feat(discord): add in-memory share content cache with 15min TTL` | `src/share-cache.ts` |
| 2 | `feat(discord): add Share with Players button builder` | `src/embeds/share-button.ts` |
| 3 | `feat(discord): handle Share with Players button interactions` | `src/index.ts` |
| 4 | `feat(discord): add Share with Players button to /scene` | `src/commands/scene.ts` |
| 5 | `feat(discord): add Share with Players button to /aspects` | `src/commands/aspects.ts` |
| 6 | `feat(discord): add Share with Players button to /npc` | `src/commands/npc.ts` |
| 7 | `feat(discord): add Share with Players button to /gm-start` | `src/commands/gm-start.ts` |
| 8 | `feat(discord): add Share with Players button to /rules GM branch` | `src/commands/rules.ts` |
| 9 | `feat(discord): add Share with Players button to /recap GM branch` | `src/commands/recap.ts` |
| 10 | `feat(discord): use "Shared by GM" footer for share button embeds` | `src/embeds/player-response.ts`, `src/index.ts` |
| 11 | `fix(discord): strip hidden aspect sections in player share content` | `src/embeds/player-response.ts` |

Steps 1-3 can be done first in sequence. Steps 4-7 are independent of each other. Steps 8-9 depend on the parallel agent's work landing first. Steps 10-11 are small follow-ups.

---

## Testing checklist

- [ ] `/scene "docking bay"` — ephemeral response with "Share with Players" button
- [ ] Click button — public blue embed appears in channel, button disables to "Shared", hidden aspects stripped
- [ ] `/aspects "zero-g firefight"` — ephemeral + button; shared version strips Hidden section
- [ ] `/npc nowak "where is the payload"` — webhook dialogue + ephemeral GM notes with button; click shares dialogue-only embed (no Intent/Hidden truth)
- [ ] `/npc nowak` with broken webhook — full embed with button; click shares stripped version
- [ ] `/rules "how does refresh work"` (fast path, as GM) — ephemeral yellow embed with button; click shares public version without Confidence line
- [ ] `/rules "complex question"` (slow path, as GM) — ephemeral red embed with button; click shares stripped version
- [ ] `/rules "how does refresh work"` (as player) — public response, no button
- [ ] `/recap` (as GM) — ephemeral + button; shared version is identical (no GM-only lines in recap)
- [ ] `/recap` (as player) — public response, no button
- [ ] `/gm-start` — ephemeral + button; click shares public version
- [ ] Wait 16 minutes, click old button — "Content expired" ephemeral message
- [ ] Different user clicks button (if somehow visible) — "Only the GM who ran the command" rejection
- [ ] Multi-embed response (long scene) — button still attached, shared version may be fewer embeds after stripping
- [ ] Bot restart, click old button — "Content expired" (cache cleared)
- [ ] TypeScript compiles clean: `npm run check` passes
