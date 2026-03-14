import { EmbedBuilder } from 'discord.js';
import type { CharacterRow } from '../db/queries.js';

const FATE_LADDER: Record<number, string> = {
  8: 'Legendary', 7: 'Epic', 6: 'Fantastic', 5: 'Superb',
  4: 'Great', 3: 'Good', 2: 'Fair', 1: 'Average',
  0: 'Mediocre', '-1': 'Poor', '-2': 'Terrible',
};

function ladderLabel(value: number): string {
  return FATE_LADDER[value] || '';
}

export function characterEmbed(char: CharacterRow): EmbedBuilder {
  const d = char.data as Record<string, unknown>;

  const embed = new EmbedBuilder()
    .setTitle(char.name)
    .setColor(0x57f287)
    .setFooter({ text: `${(d.characterState as string || 'unknown').toUpperCase()} | House ${(d.houseAffiliation as string || 'none').replace(/^\w/, (c: string) => c.toUpperCase())}` });

  // Aspects
  const aspects = d.aspects as string[] | undefined;
  if (aspects?.length) {
    embed.addFields({
      name: 'Aspects',
      value: aspects.map((a) => `"${a}"`).join('\n'),
      inline: false,
    });
  }

  // Skills (sorted by rank)
  const skills = d.skills as Record<string, number> | undefined;
  if (skills) {
    const sorted = Object.entries(skills)
      .sort(([, a], [, b]) => b - a)
      .filter(([, v]) => v > 0);

    const skillLines = sorted.map(([name, rank]) => {
      const label = ladderLabel(rank);
      const displayName = name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return `+${rank} ${label} — ${displayName}`;
    });

    embed.addFields({
      name: 'Skills',
      value: skillLines.join('\n').slice(0, 1024),
      inline: false,
    });
  }

  // Stunts
  const stunts = d.stunts as string[] | undefined;
  if (stunts?.length) {
    embed.addFields({
      name: 'Stunts',
      value: stunts.map((s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())).join(', '),
      inline: true,
    });
  }

  // Stress tracks
  const stress = d.stressTracks as Record<string, number> | undefined;
  if (stress) {
    const stressLine = Object.entries(stress)
      .map(([type, boxes]) => `${type.replace(/^\w/, (c: string) => c.toUpperCase())}: ${boxes}`)
      .join(' | ');
    embed.addFields({ name: 'Stress Tracks', value: stressLine, inline: true });
  }

  // Refresh & Rep
  const refresh = d.refreshRating as number | undefined;
  const rep = d.repRating as number | undefined;
  if (refresh !== undefined || rep !== undefined) {
    const parts: string[] = [];
    if (refresh !== undefined) parts.push(`Refresh: ${refresh}`);
    if (rep !== undefined) parts.push(`Rep: ${rep}`);
    embed.addFields({ name: 'Ratings', value: parts.join(' | '), inline: true });
  }

  // Augmentations
  const augs = d.augmentations as string[] | undefined;
  if (augs?.length) {
    embed.addFields({
      name: 'Augmentations',
      value: augs.map((a) => a.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())).join(', '),
      inline: false,
    });
  }

  // Gear
  const gear = d.startingGear as string[] | undefined;
  if (gear?.length) {
    embed.addFields({
      name: 'Gear',
      value: gear.map((g) => g.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())).join(', '),
      inline: false,
    });
  }

  // Drones
  const drones = d.ownedDrones as { drone: { name: string; tier: string; role: string } }[] | undefined;
  if (drones?.length) {
    const droneLines = drones.map((d) => `${d.drone.name} (${d.drone.tier} ${d.drone.role})`);
    embed.addFields({ name: 'Drones', value: droneLines.join('\n'), inline: false });
  }

  return embed;
}

export function characterSkillsEmbed(char: CharacterRow): EmbedBuilder {
  const d = char.data as Record<string, unknown>;
  const skills = d.skills as Record<string, number> | undefined;

  const embed = new EmbedBuilder()
    .setTitle(`${char.name} — Skills`)
    .setColor(0xfee75c);

  if (!skills) {
    embed.setDescription('No skills data found.');
    return embed;
  }

  const sorted = Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .filter(([, v]) => v > 0);

  // Group by rank
  const byRank = new Map<number, string[]>();
  for (const [name, rank] of sorted) {
    const displayName = name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    if (!byRank.has(rank)) byRank.set(rank, []);
    byRank.get(rank)!.push(displayName);
  }

  const lines: string[] = [];
  for (const [rank, names] of [...byRank.entries()].sort(([a], [b]) => b - a)) {
    const label = ladderLabel(rank);
    lines.push(`**+${rank} ${label}:** ${names.join(', ')}`);
  }

  embed.setDescription(lines.join('\n'));
  return embed;
}
