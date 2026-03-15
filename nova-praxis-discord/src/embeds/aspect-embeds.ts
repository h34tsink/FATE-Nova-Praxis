import { EmbedBuilder } from 'discord.js';
import { AspectWithUsage } from '../db/aspect-queries.js';

const COLOR_VISIBLE = 0x5865f2;    // blurple
const COLOR_HIDDEN = 0xed4245;     // red
const COLOR_INVOKE = 0x57f287;     // green
const COLOR_COMPEL = 0xe67e22;     // orange
const COLOR_CLEAR = 0x95a5a6;      // grey

function usageMarkers(aspect: AspectWithUsage): string {
  const marks: string[] = [];
  if (aspect.invocations > 0) marks.push('I'.repeat(aspect.invocations));
  if (aspect.compels > 0) marks.push('C'.repeat(aspect.compels));
  if (aspect.free_used > 0) marks.push('F'.repeat(aspect.free_used));
  return marks.join('');
}

function formatAspectTable(aspects: AspectWithUsage[]): string {
  if (aspects.length === 0) return 'No active aspects this session.';

  // Calculate column widths
  const rows = aspects.map((a) => ({
    text: a.severity ? `${a.text} (${a.severity})` : a.text,
    type: a.type,
    source: a.source || '',
    used: usageMarkers(a),
  }));

  const colWidths = {
    text: Math.max(6, ...rows.map((r) => r.text.length)),
    type: Math.max(4, ...rows.map((r) => r.type.length)),
    source: Math.max(6, ...rows.map((r) => r.source.length)),
    used: Math.max(4, ...rows.map((r) => r.used.length)),
  };

  // Cap widths to prevent overflow
  colWidths.text = Math.min(colWidths.text, 32);
  colWidths.source = Math.min(colWidths.source, 14);

  const header = [
    'Aspect'.padEnd(colWidths.text),
    'Type'.padEnd(colWidths.type),
    'Source'.padEnd(colWidths.source),
    'Used'.padEnd(colWidths.used),
  ].join(' | ');

  const separator = [
    '-'.repeat(colWidths.text),
    '-'.repeat(colWidths.type),
    '-'.repeat(colWidths.source),
    '-'.repeat(colWidths.used),
  ].join('-+-');

  const lines = rows.map((r) =>
    [
      r.text.slice(0, colWidths.text).padEnd(colWidths.text),
      r.type.padEnd(colWidths.type),
      r.source.slice(0, colWidths.source).padEnd(colWidths.source),
      r.used.padEnd(colWidths.used),
    ].join(' | ')
  );

  return '```\n' + [header, separator, ...lines].join('\n') + '\n```';
}

export function aspectListEmbed(aspects: AspectWithUsage[], sessionNum: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`Active Aspects — Session ${sessionNum}`)
    .setDescription(formatAspectTable(aspects))
    .setColor(COLOR_VISIBLE)
    .setFooter({ text: 'I = Invoked | C = Compelled | F = Free Invoke Used' });
}

export function hiddenAspectListEmbed(aspects: AspectWithUsage[], sessionNum: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(`Hidden Aspects — Session ${sessionNum}`)
    .setDescription(formatAspectTable(aspects))
    .setColor(COLOR_HIDDEN)
    .setFooter({ text: 'GM Only | I = Invoked | C = Compelled | F = Free Invoke Used' });
}

export function aspectAddedEmbed(text: string, type: string, source?: string, hidden?: boolean): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Aspect Added')
    .setColor(hidden ? COLOR_HIDDEN : COLOR_VISIBLE);

  let desc = `**"${text}"**\nType: ${type}`;
  if (source) desc += ` | Source: ${source}`;
  embed.setDescription(desc);

  if (hidden) embed.setFooter({ text: 'GM Only — hidden from players' });
  return embed;
}

export function aspectInvokedEmbed(
  aspectText: string,
  playerName: string,
  free: boolean
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Aspect Invoked')
    .setDescription(
      `**"${aspectText}"** invoked by **${playerName}**\nFP: ${free ? 'FREE INVOKE' : '-1 (paid)'}`
    )
    .setColor(COLOR_INVOKE);
}

export function aspectCompelledEmbed(aspectText: string, playerName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Aspect Compelled')
    .setDescription(`**"${aspectText}"** compelled on **${playerName}**\nFP: +1 earned`)
    .setColor(COLOR_COMPEL);
}

export function aspectClearedEmbed(removed: number, remaining: number): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Scene Aspects Cleared')
    .setDescription(
      `Scene aspects cleared. **${removed}** aspects removed. **${remaining}** persistent aspects remain.`
    )
    .setColor(COLOR_CLEAR);
}

export function aspectRemovedText(text: string): string {
  return `Removed: *${text}*`;
}
