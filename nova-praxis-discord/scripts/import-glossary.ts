import { readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const GLOSSARY_DIR = join(VAULT, 'Glossary');

interface GlossaryEntry {
  term: string;
  aliases: string[];
  short_def: string;
  long_def: string;
  tags: string[];
}

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const fm: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      const val = kv[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        fm[kv[1]] = val.slice(1, -1).split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
      } else {
        fm[kv[1]] = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  return { frontmatter: fm, body: match[2] };
}

function parseGlossaryFile(filepath: string): GlossaryEntry | null {
  const content = readFileSync(filepath, 'utf-8');
  const filename = basename(filepath, '.md');

  if (filename === 'Index' || filename.startsWith('_')) return null;

  const { frontmatter, body } = parseFrontmatter(content);

  const aliases: string[] = [];
  if (frontmatter.aliases) {
    if (Array.isArray(frontmatter.aliases)) {
      aliases.push(...(frontmatter.aliases as string[]));
    } else if (typeof frontmatter.aliases === 'string') {
      aliases.push(...(frontmatter.aliases as string).split(',').map((s: string) => s.trim()));
    }
  }

  const tags: string[] = [];
  if (frontmatter.tags) {
    if (Array.isArray(frontmatter.tags)) {
      tags.push(...(frontmatter.tags as string[]));
    } else if (typeof frontmatter.tags === 'string') {
      tags.push(...(frontmatter.tags as string).split(',').map((s: string) => s.trim()));
    }
  }

  // Strip wikilinks and markdown formatting for definitions
  const cleanBody = body
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')  // [[link|display]] -> display
    .replace(/\[\[([^\]]+)\]\]/g, '$1')               // [[link]] -> link
    .replace(/^#\s+.+$/gm, '')                        // remove headings
    .trim();

  // First non-empty paragraph is short def
  const paragraphs = cleanBody.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const short_def = paragraphs[0]?.trim() || '';
  const long_def = cleanBody;

  return {
    term: filename,
    aliases,
    short_def,
    long_def,
    tags,
  };
}

async function main() {
  console.log('Importing glossary...');
  await query('TRUNCATE glossary RESTART IDENTITY');

  const files = readdirSync(GLOSSARY_DIR).filter((f) => f.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const entry = parseGlossaryFile(join(GLOSSARY_DIR, file));
    if (!entry) continue;

    await query(
      `INSERT INTO glossary (term, aliases, short_def, long_def, tags)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (term) DO UPDATE SET
         aliases = $2, short_def = $3, long_def = $4, tags = $5`,
      [entry.term, entry.aliases, entry.short_def, entry.long_def, entry.tags]
    );
    count++;
  }

  console.log(`Imported ${count} glossary entries`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
