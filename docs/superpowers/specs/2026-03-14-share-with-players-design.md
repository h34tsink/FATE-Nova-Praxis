# Share with Players Button — Design Spec

**Date:** 2026-03-14
**Status:** Approved
**Scope:** Add "Share with Players" button to GM-only Discord embeds

## Context

GM-only commands (`/scene`, `/aspects`, `/recap`, `/rules`, `/npc`) respond with ephemeral embeds that only the GM sees. The GM sometimes wants to share portions of that output with players — scene descriptions, aspect tables, recaps — but currently has no way to do so without copy-pasting.

## Design

### How It Works

1. Every GM-only embed gets a "Share with Players" button attached
2. GM reviews the ephemeral response as usual
3. GM clicks the button
4. Bot strips GM-only content (hidden aspects, intent lines, hidden truths, GM notes)
5. Bot posts a cleaned, player-safe version as a **public embed** in the same channel
6. The embed uses blue color (0x5865f2) instead of red, with footer "Shared by GM"

### GM-Only Content Patterns to Strip

These patterns are stripped when generating the player-safe version:

| Pattern | Source Commands | Regex/Match |
|---------|---------------|-------------|
| `**Hidden truth (GM-only):**` + line | `/npc` | Line starting with `**Hidden truth` |
| `**Intent:**` + line | `/npc` | Line starting with `**Intent:` |
| `- [Hidden aspect — GM only` | `/scene` | Lines containing `GM only` in aspect lists |
| `Hidden` aspect category header + table | `/aspects` | `### Scene Aspects (Hidden)` section until next `###` |
| `GM-only` markers anywhere | All | Lines containing `(GM-only)` or `(GM only)` |
| Confidence notes | `/rules` | `**Confidence:**` line |

Content that is NOT stripped:
- Scene zones, visible aspects, NPC tables, transition hooks
- All rules answers and exceptions
- Recap state (no secrets in recap by design)
- Visible aspect categories (Obvious, Dynamic, Maneuver, Consequence, etc.)

### Implementation

#### Files to Create

- `src/embeds/player-share.ts` — `stripGmContent()` function + `playerShareEmbed()` builder

#### Files to Modify

- `src/embeds/gm-response.ts` — Add `ActionRowBuilder` + `ButtonBuilder` to embed replies, store raw content in button `customId`
- `src/index.ts` — Add `interaction.isButton()` handler in `InteractionCreate` listener
- `src/commands/scene.ts` — Make reply ephemeral (currently public), add button components
- `src/commands/aspects.ts` — Make reply ephemeral (currently public), add button components
- `src/commands/recap.ts` — Make reply ephemeral (currently public), add button components
- `src/commands/rules.ts` — Make reply ephemeral (already ephemeral if using gmResponseEmbed), add button components

#### Ephemeral Replies

Commands that currently use `interaction.deferReply()` (public) must change to `interaction.deferReply({ flags: MessageFlags.Ephemeral })`. The rules fast path uses `interaction.reply()` directly — change to `interaction.reply({ ..., flags: MessageFlags.Ephemeral })`.

#### Button Data Flow

Discord buttons have a `customId` field (max 100 chars). We can't fit the full response content in there.

**Approach: Cache in memory** — Store the **raw Claude output** (pre-`formatForDiscord()`) in a `Map<string, { title: string, content: string, timestamp: number }>` keyed by a UUID. Button `customId` = `share_${uuid}`. On click, look up the content, run `stripGmContent()` on the raw markdown, then run `formatForDiscord()` to produce the player embed. TTL: 15 minutes, evicted by periodic sweep every 5 minutes.

**Important:** `stripGmContent()` must run on raw Claude markdown, not post-format text. The `formatForDiscord()` function converts `### headers` to `**bold**`, which would break the section-based regex patterns. Pipeline: raw output -> strip GM content -> formatForDiscord() -> embed.

This avoids database writes for ephemeral data. If the bot restarts, buttons from before the restart won't work — acceptable tradeoff for session-scoped use.

#### What Each Command Caches

| Command | Cached Content | Notes |
|---------|---------------|-------|
| `/scene` | `result.output` | Full Claude response |
| `/aspects` | `result.output` | Full Claude response |
| `/recap` | `result.output` | Full Claude response |
| `/rules` (slow path) | `result.output` | Full Claude response |
| `/rules` (fast path) | `fastAnswer` | The pre-formatted DB answer string |
| `/npc` | `result.output` (full, not just gmNotes) | So share button can reconstruct dialogue + visible context |
| `/gm-start` | `result.output` | Full Claude response |

#### Stripping Logic

```typescript
function stripGmContent(content: string): string {
  return content
    .split('\n')
    .filter(line => {
      if (line.match(/^\*\*Hidden truth/i)) return false;
      if (line.match(/^\*\*Intent:/i)) return false;
      if (line.match(/\(GM[- ]only\)/i)) return false;
      if (line.match(/^\*\*Confidence:/i)) return false;
      return true;
    })
    .join('\n')
    // Remove Hidden aspects section (header + table until next ### or end)
    .replace(/###\s*Scene Aspects \(Hidden\)[\s\S]*?(?=###|$)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
```

#### Button Behavior

- Button label: "Share with Players"
- Button style: `ButtonStyle.Primary` (blue)
- On click: post public embed via `interaction.channel.send()`, then disable the button on the ephemeral message via `interaction.update({ components: [disabledRow] })` to prevent double-clicks
- If content cache miss (expired/restart): reply ephemeral "Content expired — run the command again" via `interaction.reply({ ephemeral: true })`
- Only the GM who ran the command can click the button (check `interaction.user.id`)

### What Changes Per Command

| Command | Currently | Change |
|---------|-----------|--------|
| `/scene` | Public reply | Ephemeral reply + button |
| `/aspects` | Public reply | Ephemeral reply + button |
| `/recap` | Public reply | Ephemeral reply + button |
| `/rules` | Public reply | Ephemeral reply + button |
| `/npc` | Already ephemeral + webhook | Cache full `result.output`. Button on GM notes re-shares dialogue (stripped of Intent/Hidden truth) as a public embed. Useful when webhook failed or GM wants a formatted embed version. |
| `/gm-start` | Public reply | Ephemeral reply + button (though rarely shared) |

### Edge Cases

- **Multi-embed responses** (content > 4096 chars): Cache the full raw content, not the split embeds. Stripping may reduce it enough to fit in one embed.
- **No GM-only content to strip**: If stripping removes nothing, the shared version is identical. That's fine — the GM explicitly chose to share.
- **Button clicked twice**: Button is disabled after first click via `interaction.update({ components: [disabledRow] })`.

## Testing Plan

1. Run `/scene "docking bay"` — verify ephemeral + button appears
2. Click "Share with Players" — verify public blue embed appears without hidden aspects
3. Run `/npc nowak "where is the payload"` — verify GM notes have button, clicking posts a public embed with dialogue only (Intent/Hidden truth stripped)
4. Run `/aspects "zero-g firefight"` — verify hidden aspect category is stripped from shared version
5. Run `/recap` — verify full content shares (no GM-only lines in recap)
6. Wait 15+ minutes, click old button — verify "Content expired" message
