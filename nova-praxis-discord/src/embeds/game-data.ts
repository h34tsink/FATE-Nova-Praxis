import { EmbedBuilder } from 'discord.js';
import type { GameDataRow } from '../db/queries.js';

const CATEGORY_COLORS: Record<string, number> = {
  gear: 0x5865f2,
  armor_feature: 0x5865f2,
  augmentation: 0xeb459e,
  sleeve: 0x57f287,
  skill: 0xfee75c,
  state: 0xed4245,
  house: 0xf47b67,
  fate_ladder: 0x99aab5,
};

export function gameDataEmbed(item: GameDataRow): EmbedBuilder {
  const meta = item.metadata || {};
  const color = CATEGORY_COLORS[item.category] || 0x99aab5;

  const embed = new EmbedBuilder()
    .setTitle(item.name)
    .setColor(color)
    .setFooter({ text: item.category.replace(/_/g, ' ').toUpperCase() });

  if (item.description) {
    embed.setDescription(item.description.slice(0, 4096));
  }

  // Add key metadata fields
  const skip = new Set(['id', 'name', 'description', 'short', 'long', 'long_description', 'short_description', 'long_summary', 'short_summary']);
  const fields: { name: string; value: string; inline: boolean }[] = [];

  for (const [key, value] of Object.entries(meta)) {
    if (skip.has(key)) continue;
    if (value === null || value === undefined || value === '') continue;
    if (typeof value === 'object') continue; // skip nested objects in fields
    if (fields.length >= 10) break; // Discord limit is 25, keep it scannable

    fields.push({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value: String(value).slice(0, 1024),
      inline: String(value).length < 50,
    });
  }

  if (fields.length > 0) embed.addFields(fields);

  return embed;
}

export function gameDataListEmbed(items: GameDataRow[], searchQuery: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`Search: "${searchQuery}"`)
    .setColor(0x5865f2)
    .setFooter({ text: `${items.length} result${items.length === 1 ? '' : 's'}` });

  const lines = items.map((item, i) => {
    const cat = item.category.replace(/_/g, ' ');
    const desc = item.description ? ` — ${item.description.slice(0, 80)}` : '';
    return `**${i + 1}. ${item.name}** [${cat}]${desc}`;
  });

  embed.setDescription(lines.join('\n').slice(0, 4096));
  return embed;
}
