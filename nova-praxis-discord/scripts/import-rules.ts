import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const RULES_DIR = join(VAULT, 'Rules and Mechanics');

interface RulesSection {
  file_path: string;
  heading: string;
  subsystem: string;
  content: string;
}

const SUBSYSTEM_MAP: Record<string, string> = {
  'Gameplay': 'core',
  'Skills': 'skills',
  'Stunts': 'stunts',
  'Character States': 'states',
  'Augmentations': 'augmentations',
  'Sleeves': 'sleeves',
  'Firearms': 'firearms',
  'Melee': 'melee',
  'Explosives': 'explosives',
  'Armor': 'armor',
  'Equipment': 'equipment',
  'Drones Overview': 'drones',
  'Savant Programs Guide': 'savant',
  'Mnemonic Editing': 'mnemonics',
  'Rules Quick Reference - Unified': 'reference',
};

function guessSubsystem(filename: string): string {
  const name = basename(filename, '.md');
  for (const [key, value] of Object.entries(SUBSYSTEM_MAP)) {
    if (name.includes(key)) return value;
  }
  if (name.toLowerCase().includes('pneuma')) return 'pneuma';
  return 'general';
}

function chunkByHeading(content: string, filepath: string): RulesSection[] {
  const sections: RulesSection[] = [];
  const subsystem = guessSubsystem(filepath);

  // Strip frontmatter
  const body = content.replace(/^---[\s\S]*?---\n/, '');

  // Split on H2 and H3 headings
  const parts = body.split(/(?=^#{2,3}\s+)/m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^(#{2,3})\s+(.+)/);
    const heading = headingMatch ? headingMatch[2].trim() : basename(filepath, '.md');
    const content = headingMatch ? trimmed.slice(headingMatch[0].length).trim() : trimmed;

    if (content.length < 10) continue; // skip empty sections

    sections.push({
      file_path: filepath,
      heading,
      subsystem,
      content,
    });
  }

  // If no sections found, treat whole file as one section
  if (sections.length === 0 && body.trim().length > 10) {
    sections.push({
      file_path: filepath,
      heading: basename(filepath, '.md'),
      subsystem,
      content: body.trim(),
    });
  }

  return sections;
}

async function main() {
  console.log('Importing rules sections...');
  await query('TRUNCATE rules_sections RESTART IDENTITY');

  const files = readdirSync(RULES_DIR, { recursive: true })
    .map((f) => f.toString())
    .filter((f) => f.endsWith('.md'));

  let totalSections = 0;

  for (const file of files) {
    const filepath = join(RULES_DIR, file);
    const content = readFileSync(filepath, 'utf-8');
    const sections = chunkByHeading(content, file);

    for (const section of sections) {
      await query(
        `INSERT INTO rules_sections (file_path, heading, subsystem, content)
         VALUES ($1, $2, $3, $4)`,
        [section.file_path, section.heading, section.subsystem, section.content]
      );
    }

    console.log(`  ${file}: ${sections.length} sections`);
    totalSections += sections.length;
  }

  console.log(`Total: ${totalSections} rules sections imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
