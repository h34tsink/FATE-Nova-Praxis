import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const ENTITY_DIR = join(VAULT, 'GM AI', 'Entity Cards');

interface EntityCard {
  token: string;
  name: string;
  rank: number;
  class: string;
  faction: string;
  voice_profile: Record<string, unknown>;
  full_card: string;
}

function parseFrontmatter(content: string): { fm: Record<string, string>; body: string } {
  // Normalize Windows line endings before parsing
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: normalized };

  const fm: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return { fm, body: match[2] };
}

function extractVoiceProfile(body: string): Record<string, unknown> {
  const profile: Record<string, unknown> = {};

  // Look for Voice Profile section
  const voiceMatch = body.match(/##\s*Voice Profile\s*\n([\s\S]*?)(?=\n##\s|\n---|\$)/);
  if (voiceMatch) {
    const voiceText = voiceMatch[1];
    // Extract bullet points
    const bullets = voiceText.match(/^[-*]\s+\*\*(.+?)\*\*[:\s]*(.+)$/gm);
    if (bullets) {
      for (const bullet of bullets) {
        const m = bullet.match(/^[-*]\s+\*\*(.+?)\*\*[:\s]*(.+)$/);
        if (m) {
          const key = m[1].toLowerCase().replace(/\s+/g, '_');
          profile[key] = m[2].trim();
        }
      }
    }
  }

  return profile;
}

function parseEntityCard(filepath: string, rankFolder: string): EntityCard | null {
  const content = readFileSync(filepath, 'utf-8');
  const { fm, body } = parseFrontmatter(content);

  const filename = basename(filepath, '.md');

  // Extract rank — try frontmatter (handles "R3" or "3"), then folder name, then 0
  const rankMatch = rankFolder.match(/R(\d)/);
  const fmRankNum = fm.rank ? parseInt(fm.rank.replace(/[^0-9]/g, '')) : NaN;
  const rank = !isNaN(fmRankNum) && fmRankNum > 0
    ? fmRankNum
    : rankMatch ? parseInt(rankMatch[1]) : 0;

  // Extract token from frontmatter or generate from name
  const token = fm.token || filename.split('(')[0].trim().toLowerCase().replace(/\s+/g, '_');

  // Extract name — first part before parenthetical in filename, or from frontmatter
  const nameMatch = filename.match(/^(.+?)\s*\(/);
  const name = fm.name || (nameMatch ? nameMatch[1].trim() : filename);

  // Extract class from parenthetical in filename
  const classMatch = filename.match(/\((.+)\)/);
  const entityClass = fm.class || (classMatch ? classMatch[1].trim() : '');

  const faction = fm.faction || '';

  return {
    token,
    name,
    rank,
    class: entityClass,
    faction,
    voice_profile: extractVoiceProfile(body),
    full_card: content,
  };
}

async function upsertCard(card: EntityCard, label: string) {
  await query(
    `INSERT INTO entity_cards (token, name, rank, class, faction, voice_profile, full_card)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (token) DO UPDATE SET
       name = $2, rank = $3, class = $4, faction = $5, voice_profile = $6, full_card = $7`,
    [card.token, card.name, card.rank, card.class, card.faction, JSON.stringify(card.voice_profile), card.full_card]
  );
  console.log(`  ${label}: ${card.token} (R${card.rank})`);
}

async function main() {
  console.log('Importing entity cards...');
  await query('TRUNCATE entity_cards RESTART IDENTITY');

  let count = 0;

  // Walk GM AI/Entity Cards/R1-R5 folders
  const rankFolders = readdirSync(ENTITY_DIR).filter((f) => f.startsWith('R'));
  for (const rankFolder of rankFolders) {
    const folderPath = join(ENTITY_DIR, rankFolder);
    const files = readdirSync(folderPath).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const card = parseEntityCard(join(folderPath, file), rankFolder);
      if (!card) continue;
      await upsertCard(card, `${rankFolder}/${file}`);
      count++;
    }
  }

  // Also import Characters/Named NPCs/ as entity cards
  // Skip any token that was already imported from GM AI/Entity Cards/ (don't overwrite richer cards)
  const existingTokens = new Set(
    (await query<{ token: string }>('SELECT token FROM entity_cards')).rows.map((r) => r.token)
  );

  const namedNpcDir = join(VAULT, 'Characters', 'Named NPCs');
  try {
    const npcFiles = readdirSync(namedNpcDir).filter((f) => f.endsWith('.md'));
    for (const file of npcFiles) {
      const card = parseEntityCard(join(namedNpcDir, file), '');
      if (!card) continue;
      if (!card.rank) card.rank = 2;
      if (existingTokens.has(card.token)) {
        console.log(`  Named NPCs/${file}: skipped (entity card exists)`);
        continue;
      }
      await upsertCard(card, `Named NPCs/${file}`);
      count++;
    }
  } catch (err) {
    console.error('  Named NPCs import error:', err);
  }

  console.log(`Total: ${count} entity cards imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
