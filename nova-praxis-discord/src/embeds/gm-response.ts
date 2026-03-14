import { EmbedBuilder } from 'discord.js';

const MAX_EMBED_DESC = 4096;
const MAX_FIELD_VALUE = 1024;

export function gmResponseEmbed(title: string, content: string): EmbedBuilder[] {
  const embeds: EmbedBuilder[] = [];

  if (content.length <= MAX_EMBED_DESC) {
    embeds.push(
      new EmbedBuilder()
        .setTitle(title)
        .setDescription(content)
        .setColor(0xed4245)
        .setFooter({ text: 'GM Only | Powered by Claude' })
    );
    return embeds;
  }

  // Split into multiple embeds if too long
  const chunks: string[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_EMBED_DESC) {
      chunks.push(remaining);
      break;
    }

    // Try to split at a paragraph boundary
    let splitIdx = remaining.lastIndexOf('\n\n', MAX_EMBED_DESC);
    if (splitIdx < MAX_EMBED_DESC / 2) {
      // Fall back to line boundary
      splitIdx = remaining.lastIndexOf('\n', MAX_EMBED_DESC);
    }
    if (splitIdx < MAX_EMBED_DESC / 2) {
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
    .setDescription(answer.slice(0, MAX_EMBED_DESC))
    .setColor(0xfee75c)
    .addFields({ name: 'Source', value: source.slice(0, MAX_FIELD_VALUE), inline: false })
    .setFooter({ text: 'Fast lookup from indexed rules' });
}
