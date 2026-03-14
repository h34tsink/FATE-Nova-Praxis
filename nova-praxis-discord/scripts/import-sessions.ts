import { readdirSync, readFileSync, statSync } from 'fs';
import { join, basename } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const SESSIONS_DIR = join(VAULT, 'Sessions');

// File types that are useful for context
const FILE_TYPE_MAP: Record<string, string> = {
  'Ops Index': 'index',
  'Guide': 'guide',
  'Scenes and Zones': 'scenes',
  'GM Command Board': 'state',
  'Live Dashboard': 'state',
  'Beats': 'beats',
  'Game Summary': 'summary',
};

function guessFileType(filename: string): string {
  for (const [key, type] of Object.entries(FILE_TYPE_MAP)) {
    if (filename.includes(key)) return type;
  }
  return 'general';
}

function chunkByHeading(content: string, filepath: string, sessionNum: number): {
  heading: string; content: string; file_type: string;
}[] {
  const sections: { heading: string; content: string; file_type: string }[] = [];
  const fileType = guessFileType(filepath);

  // Strip frontmatter
  const body = content.replace(/^---[\s\S]*?---\n/, '');

  const parts = body.split(/(?=^#{1,3}\s+)/m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.length < 20) continue;

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    const heading = headingMatch ? headingMatch[2].trim() : basename(filepath, '.md');
    const sectionContent = headingMatch ? trimmed.slice(headingMatch[0].length).trim() : trimmed;

    if (sectionContent.length < 10) continue;

    sections.push({ heading, content: sectionContent, file_type: fileType });
  }

  if (sections.length === 0 && body.trim().length > 20) {
    sections.push({
      heading: basename(filepath, '.md'),
      content: body.trim(),
      file_type: fileType,
    });
  }

  return sections;
}

async function main() {
  console.log('Importing session data...');
  await query('TRUNCATE sessions RESTART IDENTITY');

  let totalSections = 0;
  const sessionDirs = readdirSync(SESSIONS_DIR)
    .filter((d) => d.startsWith('Session '))
    .sort();

  for (const dir of sessionDirs) {
    const match = dir.match(/Session (\d+)/);
    if (!match) continue;
    const sessionNum = parseInt(match[1]);
    const sessionPath = join(SESSIONS_DIR, dir);

    // Get all .md files recursively
    const files: string[] = [];
    function walk(dirPath: string) {
      for (const entry of readdirSync(dirPath)) {
        const fullPath = join(dirPath, entry);
        if (statSync(fullPath).isDirectory()) {
          walk(fullPath);
        } else if (entry.endsWith('.md')) {
          files.push(fullPath);
        }
      }
    }
    walk(sessionPath);

    let sessionSections = 0;
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const relPath = file.replace(sessionPath + '/', '').replace(sessionPath + '\\', '');
      const sections = chunkByHeading(content, relPath, sessionNum);

      for (const section of sections) {
        await query(
          `INSERT INTO sessions (session_num, file_path, file_type, heading, content)
           VALUES ($1, $2, $3, $4, $5)`,
          [sessionNum, relPath, section.file_type, section.heading, section.content]
        );
      }
      sessionSections += sections.length;
    }

    console.log(`  Session ${sessionNum}: ${files.length} files, ${sessionSections} sections`);
    totalSections += sessionSections;
  }

  console.log(`Total: ${totalSections} session sections imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
