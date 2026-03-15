import { EmbedBuilder } from 'discord.js';

const MAX_EMBED_DESC = 4096;
const MAX_FIELD_VALUE = 1024;

/**
 * Convert markdown to Discord-compatible format.
 * Discord embeds support: **bold**, *italic*, `code`, ```code blocks```, > quotes, ||spoilers||
 * Discord does NOT support: # headers, markdown tables, images
 */
export function formatForDiscord(text: string): string {
  let result = text;

  // Convert markdown tables to fixed-width code blocks
  result = result.replace(
    /((?:^\|.+\|$\n?)+)/gm,
    (tableBlock) => {
      const rows = tableBlock.trim().split('\n');

      // Parse all rows into cells
      const parsed = rows
        .filter((r) => !r.match(/^\|[\s-:|]+\|$/)) // skip separator rows
        .map((row) =>
          row
            .split('|')
            .slice(1, -1) // trim empty first/last from split
            .map((cell) => cell.trim())
        );

      if (parsed.length === 0) return tableBlock;

      // Calculate column widths
      const colCount = Math.max(...parsed.map((r) => r.length));
      const widths: number[] = [];
      for (let c = 0; c < colCount; c++) {
        widths[c] = Math.max(...parsed.map((r) => (r[c] || '').length), 2);
      }

      // Build aligned table
      const lines: string[] = [];
      for (let i = 0; i < parsed.length; i++) {
        const row = parsed[i];
        const cells = [];
        for (let c = 0; c < colCount; c++) {
          cells.push((row[c] || '').padEnd(widths[c]));
        }
        lines.push(cells.join(' | '));

        // Add separator after header row
        if (i === 0 && parsed.length > 1) {
          lines.push(widths.map((w) => '-'.repeat(w)).join('-+-'));
        }
      }

      return '```\n' + lines.join('\n') + '\n```';
    }
  );

  // Convert # headers to **bold** (Discord doesn't render headers in embeds)
  result = result.replace(/^#{4,6}\s+(.+)$/gm, '***$1***');
  result = result.replace(/^#{1,3}\s+(.+)$/gm, '**$1**');

  return result;
}

export function gmResponseEmbed(title: string, content: string): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];
  const formatted = formatForDiscord(content);

  if (formatted.length <= MAX_EMBED_DESC) {
    embeds.push(
      new EmbedBuilder()
        .setTitle(title)
        .setDescription(formatted)
        .setColor(0xed4245)
        .setFooter({ text: 'GM Only | Powered by Claude' })
    );
    return embeds;
  }

  // Split into multiple embeds if too long
  const chunks: string[] = [];
  let remaining = formatted;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_EMBED_DESC) {
      chunks.push(remaining);
      break;
    }

    let splitIdx = remaining.lastIndexOf('\n\n', MAX_EMBED_DESC);

    // Don't split inside code blocks
    const beforeSplit = remaining.slice(0, splitIdx);
    const openBlocks = (beforeSplit.match(/```/g) || []).length;
    if (openBlocks % 2 !== 0) {
      const closeIdx = remaining.indexOf('```', splitIdx);
      if (closeIdx !== -1 && closeIdx + 3 < remaining.length) {
        splitIdx = closeIdx + 3;
      }
    }

    if (splitIdx < MAX_EMBED_DESC / 4 || splitIdx > MAX_EMBED_DESC) {
      splitIdx = remaining.lastIndexOf('\n', MAX_EMBED_DESC);
    }
    if (splitIdx < MAX_EMBED_DESC / 4) {
      splitIdx = MAX_EMBED_DESC;
    }

    chunks.push(remaining.slice(0, splitIdx));
    remaining = remaining.slice(splitIdx).trimStart();
  }

  for (let i = 0; i < chunks.length; i++) {
    const embed = new EmbedBuilder()
      .setDescription(chunks[i])
      .setColor(0xed4245);

    if (i === 0) embed.setTitle(title);
    if (i === chunks.length - 1) {
      embed.setFooter({ text: 'GM Only | Powered by Claude' });
    }

    embeds.push(embed);
  }

  return embeds;
}

export function rulesEmbed(answer: string, source: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Rules Lookup')
    .setDescription(formatForDiscord(answer).slice(0, MAX_EMBED_DESC))
    .setColor(0xfee75c)
    .addFields({ name: 'Source', value: source.slice(0, MAX_FIELD_VALUE), inline: false })
    .setFooter({ text: 'Fast lookup from indexed rules' });
}
