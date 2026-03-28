import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/Nova Praxis';
const RULES_DIR = join(VAULT, 'Rules and Mechanics');
const EXTRACTS_DIR = join(VAULT, '_Assets', 'Extracts');

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

// Chapter-to-subsystem mapping for PDF extracts
const CHAPTER_SUBSYSTEM: Record<string, string> = {
  'OVERVIEW': 'lore',
  'THE GALAXY': 'lore',
  'AGENDAS': 'factions',
  'GAMEPLAY': 'core',
  'CHARACTERS': 'characters',
  'GEAR': 'gear',
  'APPENDIX': 'reference',
};

/**
 * Chunk a plain-text PDF extract by ALL-CAPS headings.
 * Splits on lines that are entirely uppercase words (section titles in the extract).
 */
function chunkExtract(content: string, filepath: string): RulesSection[] {
  const lines = content.split('\n');
  const sections: RulesSection[] = [];
  let currentHeading = '';
  let currentSubsystem = 'general';
  let currentChapter = '';
  let buffer: string[] = [];

  // Skip table of contents — find the second occurrence of "CHAPTER 1"
  const chapterStarts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^CHAPTER\s+\d+/.test(lines[i].trim())) chapterStarts.push(i);
  }
  // The first batch is TOC entries, real content starts at the repeated chapters
  const contentStart = chapterStarts.length > 7 ? chapterStarts[7] : 0;

  function flush() {
    const text = buffer.join('\n').trim();
    if (currentHeading && text.length > 50) {
      sections.push({
        file_path: filepath,
        heading: currentHeading,
        subsystem: currentSubsystem,
        content: text.slice(0, 2000), // cap to keep chunks indexable
      });
    }
    buffer = [];
  }

  for (let i = contentStart; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect chapter headers
    const chapterMatch = line.match(/^CHAPTER\s+\d+\s*[–-]\s*(.+)/);
    if (chapterMatch) {
      flush();
      currentChapter = chapterMatch[1].trim();
      currentSubsystem = CHAPTER_SUBSYSTEM[currentChapter] || 'general';
      currentHeading = currentChapter;
      continue;
    }

    // Detect section headings: lines that are mostly uppercase, 3+ chars, no trailing punctuation
    if (line.length >= 3 && line.length < 60 && /^[A-Z][A-Z\s&,'-]+$/.test(line) && !/^\d+$/.test(line)) {
      flush();
      currentHeading = line.replace(/\s+/g, ' ');
      continue;
    }

    // Skip page numbers (standalone digits)
    if (/^\d{1,3}$/.test(line)) continue;

    buffer.push(lines[i]);
  }

  flush();
  return sections;
}

async function importSections(sections: RulesSection[]): Promise<number> {
  for (const section of sections) {
    await query(
      `INSERT INTO rules_sections (file_path, heading, subsystem, content)
       VALUES ($1, $2, $3, $4)`,
      [section.file_path, section.heading, section.subsystem, section.content]
    );
  }
  return sections.length;
}

async function main() {
  console.log('Importing rules sections...');
  await query('TRUNCATE rules_sections RESTART IDENTITY');

  let totalSections = 0;

  // Import vault markdown rules
  const files = readdirSync(RULES_DIR, { recursive: true })
    .map((f) => f.toString())
    .filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filepath = join(RULES_DIR, file);
    const content = readFileSync(filepath, 'utf-8');
    const sections = chunkByHeading(content, file);
    const count = await importSections(sections);
    console.log(`  ${file}: ${count} sections`);
    totalSections += count;
  }

  // Import PDF extracts
  const extractFiles = ['pdf_full_extract.txt', 'machinations_full_extract.txt'];
  for (const file of extractFiles) {
    const filepath = join(EXTRACTS_DIR, file);
    if (!existsSync(filepath)) {
      console.log(`  ${file}: not found, skipping`);
      continue;
    }
    const content = readFileSync(filepath, 'utf-8');
    const sections = chunkExtract(content, file);
    const count = await importSections(sections);
    console.log(`  ${file}: ${count} sections`);
    totalSections += count;
  }

  console.log(`Total: ${totalSections} rules sections imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
