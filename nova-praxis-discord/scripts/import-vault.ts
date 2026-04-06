/**
 * import-vault.ts
 * Indexes all vault markdown into vault_notes for catch-all search.
 * Skips folders already covered by specialized importers.
 * Only re-indexes files whose mtime has changed since last sync.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';

// Folders with dedicated importers — skip entirely
const SKIP_FOLDERS = new Set([
  'Sessions',           // → sessions table
  'Glossary',           // → glossary table
  'Rules and Mechanics', // → rules_sections table
  'Mechanics',          // legacy, superseded
  'Data',               // TypeScript source files
  '_Assets',            // PDFs, scripts, images
  'Archive',            // deprecated content
  'Templates',          // authoring templates, not lore
  '.obsidian',          // obsidian config
  '.claude',            // claude config
  '.trash',             // deleted files
  'nova-praxis-character-creator', // SvelteKit app
  'nova-praxis-discord',           // this bot
]);

// Entity Cards handled by entity_cards table — skip that subfolder only
const SKIP_PATHS = new Set([
  'GM AI/Entity Cards',
]);

function shouldSkip(relPath: string): boolean {
  const parts = relPath.split(/[\\/]/);
  if (SKIP_FOLDERS.has(parts[0])) return true;
  // Check skip paths (multi-segment)
  for (const skip of SKIP_PATHS) {
    if (relPath.startsWith(skip)) return true;
  }
  return false;
}

function parseFrontmatter(content: string): { title: string; tags: string[]; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    // No frontmatter — extract title from first H1
    const h1 = content.match(/^#\s+(.+)$/m);
    return { title: h1?.[1]?.trim() ?? '', tags: [], body: content };
  }

  const fm = match[1];
  const body = match[2];

  // Extract title
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const h1 = body.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? h1?.[1]?.trim() ?? '';

  // Extract tags — handle both inline and block YAML list
  const tags: string[] = [];
  const tagsBlock = fm.match(/^tags:\s*\n((?:\s+-\s+.+\n?)*)/m);
  const tagsInline = fm.match(/^tags:\s*\[(.+)\]/m);
  if (tagsBlock) {
    for (const line of tagsBlock[1].split('\n')) {
      const t = line.match(/^\s+-\s+(.+)$/);
      if (t) tags.push(t[1].trim());
    }
  } else if (tagsInline) {
    tags.push(...tagsInline[1].split(',').map((t) => t.trim().replace(/["']/g, '')));
  }

  return { title, tags, body };
}

function* walkVault(dir: string, vaultRoot: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    const relPath = relative(vaultRoot, fullPath).replace(/\\/g, '/');

    if (shouldSkip(relPath)) continue;

    if (entry.isDirectory()) {
      yield* walkVault(fullPath, vaultRoot);
    } else if (entry.name.endsWith('.md')) {
      yield fullPath;
    }
  }
}

async function main() {
  console.log('Importing vault notes...');

  // Load existing mtimes for smart re-indexing
  const existing = await query<{ file_path: string; file_mtime: string }>(
    'SELECT file_path, file_mtime FROM vault_notes'
  );
  const knownMtimes = new Map(existing.rows.map((r) => [r.file_path, parseInt(r.file_mtime ?? '0')]));

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const fullPath of walkVault(VAULT, VAULT)) {
    const relPath = relative(VAULT, fullPath).replace(/\\/g, '/');
    const stat = statSync(fullPath);
    const mtime = stat.mtimeMs;

    // Skip unchanged files
    const knownMtime = knownMtimes.get(relPath);
    if (knownMtime && Math.abs(knownMtime - mtime) < 1000) {
      skipped++;
      continue;
    }

    const rawContent = readFileSync(fullPath, 'utf-8');
    const { title, tags, body } = parseFrontmatter(rawContent);
    const resolvedTitle = title || basename(fullPath, '.md');

    // Top-level folder
    const folder = relPath.split('/')[0] ?? '';

    // Strip wikilinks and markdown syntax for cleaner search text
    const cleanContent = body
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias ?? target)
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 8000); // cap content length per note

    const isNew = knownMtime === undefined;

    await query(
      `INSERT INTO vault_notes (file_path, title, folder, tags, content, file_mtime)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (file_path) DO UPDATE SET
         title = $2, folder = $3, tags = $4, content = $5, file_mtime = $6, indexed_at = now()`,
      [relPath, resolvedTitle, folder, tags, cleanContent, Math.round(mtime)]
    );

    if (isNew) inserted++;
    else updated++;
  }

  console.log(`  vault notes: ${inserted} new, ${updated} updated, ${skipped} unchanged`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
