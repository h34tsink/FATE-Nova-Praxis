import { EmbedBuilder } from 'discord.js';
import { formatForDiscord } from './gm-response.js';

const MAX_EMBED_DESC = 4096;

const GM_PATTERNS = [
  /^[ \t]*\*\*Confidence:\*\*.*/gm,
  /^[ \t]*\*\*Hidden truth.*/gm,
  /^[ \t]*\*\*Intent:\*\*.*/gm,
  /^.*\(GM[- ]only\).*/gim,
  /^.*\*\*Pacing:\*\*.*/gm,
  /^.*\*\*Exposure clock.*/gm,
  /^.*\*\*Next Beat:\*\*.*/gm,
];

export function stripGmContent(content: string): string {
  let result = content;
  for (const pattern of GM_PATTERNS) {
    result = result.replace(pattern, '');
  }
  // Strip hidden aspect section blocks
  result = result.replace(/###\s*Scene Aspects \(Hidden\)[\s\S]*?(?=###|$)/g, '');
  // Collapse runs of 3+ newlines into 2
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
}

export function playerResponseEmbed(
  title: string,
  content: string,
  footer = 'Powered by Claude'
): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];
  const formatted = formatForDiscord(stripGmContent(content));

  if (formatted.length <= MAX_EMBED_DESC) {
    embeds.push(
      new EmbedBuilder()
        .setTitle(title)
        .setDescription(formatted)
        .setColor(0x5865f2)
        .setFooter({ text: footer })
    );
    return embeds;
  }

  const chunks: string[] = [];
  let remaining = formatted;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_EMBED_DESC) {
      chunks.push(remaining);
      break;
    }

    let splitIdx = remaining.lastIndexOf('\n\n', MAX_EMBED_DESC);

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
      .setColor(0x5865f2);

    if (i === 0) embed.setTitle(title);
    if (i === chunks.length - 1) {
      embed.setFooter({ text: 'Powered by Claude' });
    }

    embeds.push(embed);
  }

  return embeds;
}
