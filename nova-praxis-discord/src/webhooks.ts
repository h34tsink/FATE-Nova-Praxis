import { TextChannel, Webhook, WebhookClient, EmbedBuilder } from 'discord.js';

const webhookCache = new Map<string, Webhook>();

// NPC display names and avatar colors (used to generate placeholder avatars)
const NPC_PROFILES: Record<string, { displayName: string; color: string }> = {
  kestrel: { displayName: 'Kestrel', color: '8B0000' },
  nowak: { displayName: 'Isabella Nowak', color: '4B0082' },
  isabella_nowak: { displayName: 'Isabella Nowak', color: '4B0082' },
  chimera: { displayName: 'Chimera', color: '000000' },
  valare_fork: { displayName: 'Valare (Fork)', color: '006400' },
  valare_integrated: { displayName: 'Valare', color: '228B22' },
  valare: { displayName: 'Valare', color: '228B22' },
  seren: { displayName: 'Seren', color: '4682B4' },
  kal_paddock: { displayName: 'Kal Paddock', color: 'B8860B' },
  lighthouse_tactical_controller: { displayName: 'Lighthouse', color: '708090' },
  declan_royce: { displayName: 'Declan Royce', color: '2F4F4F' },
  declan_yuen: { displayName: 'Patch Yuen', color: 'CD853F' },
  joss_taban: { displayName: 'Joss Taban', color: 'BC8F8F' },
  mira_okafor: { displayName: 'Mira Okafor', color: 'DAA520' },
  sera_ivanova: { displayName: 'Sera Ivanova', color: '8FBC8F' },
  nola_fisk: { displayName: 'Nola Fisk', color: '5F9EA0' },
  udo_grein: { displayName: 'Udo Grein', color: '808000' },
};

function getAvatarUrl(token: string): string {
  const profile = NPC_PROFILES[token];
  const color = profile?.color || '666666';
  const initials = (profile?.displayName || token)
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use UI Avatars API for placeholder avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=128&bold=true`;
}

async function getOrCreateWebhook(channel: TextChannel): Promise<Webhook> {
  const cached = webhookCache.get(channel.id);
  if (cached) return cached;

  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find((wh) => wh.name === 'Nova Praxis NPC');

  if (!webhook) {
    webhook = await channel.createWebhook({ name: 'Nova Praxis NPC' });
  }

  webhookCache.set(channel.id, webhook);
  return webhook;
}

export async function sendAsNpc(
  channel: TextChannel,
  token: string,
  content: string,
  embeds?: EmbedBuilder[]
): Promise<void> {
  const profile = NPC_PROFILES[token];
  const displayName = profile?.displayName || token.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const avatarUrl = getAvatarUrl(token);

  const webhook = await getOrCreateWebhook(channel);

  await webhook.send({
    username: displayName,
    avatarURL: avatarUrl,
    content: content || undefined,
    embeds: embeds || undefined,
  });
}
