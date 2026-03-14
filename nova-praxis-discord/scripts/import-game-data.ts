import { readFileSync } from 'fs';
import { join } from 'path';
import { query, end } from './db-connect.js';

const VAULT = process.env.VAULT_PATH || 'd:/ObsidianVaults/FATE - Nova Praxis';
const DATA_DIR = join(VAULT, 'Data');

function stripTypeAnnotations(src: string): string {
  return src
    // Remove import type and import { } from '../types' etc
    .replace(/^import\s+type\s+.*$/gm, '')
    .replace(/^import\s+\{[^}]*\}\s+from\s+['"]\.\.\/types['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]*\}\s+from\s+['"]\.\.\/domain\/[^'"]+['"];?\s*$/gm, '')
    .replace(/^export\s+type\s+.*$/gm, '')
    // Remove type annotations on variables: `: TypeName[]` or `: TypeName`
    .replace(/:\s*(Augmentation|CharacterState|House|SleeveVariant|GearItem|GearFeature|SleeveVariant)\[\]/g, '')
    .replace(/:\s*(Augmentation|CharacterState|House|SleeveVariant|GearItem|GearFeature|SleeveVariant)\b/g, '')
    // Remove function parameter type annotations: (param: type) -> (param)
    .replace(/(\w+)\s*:\s*(?:string|number|boolean|unknown|void|any)(?:\s*\[\s*\])?/g, '$1')
    // Remove function return type annotations: ): Type => or ): Type {
    .replace(/\)\s*:\s*\w+(?:\[\])?\s*(?:\|\s*\w+(?:\[\])?)?\s*(?=[{=])/g, ') ')
    // Remove export { } re-exports
    .replace(/^export\s+\{[^}]*\};?\s*$/gm, '')
    // Convert exports
    .replace(/^export\s+const\s+/gm, 'const ')
    .replace(/^export\s+default\s+/gm, 'module.exports = ')
    .replace(/^export\s+function\s+/gm, 'function ');
}

function evalDataFile(filename: string, exportName: string): unknown[] {
  const raw = readFileSync(join(DATA_DIR, filename), 'utf-8');
  const cleaned = stripTypeAnnotations(raw);

  const fn = new Function('module', 'exports', cleaned + `\nreturn ${exportName};`);
  const mod = { exports: {} };
  return fn(mod, mod.exports) as unknown[];
}

interface ImportItem {
  category: string;
  name: string;
  description: string;
  metadata: Record<string, unknown>;
}

function flattenGear(): ImportItem[] {
  const items: ImportItem[] = [];

  // Armor features
  const armorFeatures = evalDataFile('gear.ts', 'armorFeatures') as Record<string, unknown>[];
  for (const f of armorFeatures) {
    items.push({
      category: 'armor_feature',
      name: f.name as string,
      description: (f.description as string) || (f.effect as string) || '',
      metadata: f,
    });
  }

  // Try to get main gear arrays
  const raw = readFileSync(join(DATA_DIR, 'gear.ts'), 'utf-8');

  // Extract all exported const arrays
  const arrayExports = raw.matchAll(/export\s+const\s+(\w+)\s*(?::\s*\w+(?:\[\])?)\s*=\s*\[/g);
  for (const match of arrayExports) {
    const varName = match[1];
    if (varName === 'armorFeatures') continue; // already handled
    try {
      const arr = evalDataFile('gear.ts', varName) as Record<string, unknown>[];
      const category = varName.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      for (const item of arr) {
        items.push({
          category: category,
          name: (item.name as string) || (item.id as string) || 'Unknown',
          description: (item.description as string) || (item.short as string) || (item.effect as string) || '',
          metadata: item,
        });
      }
    } catch {
      console.warn(`  Skipping gear export: ${varName}`);
    }
  }

  return items;
}

function flattenAugmentations(): ImportItem[] {
  const raw = readFileSync(join(DATA_DIR, 'augmentations.ts'), 'utf-8');
  const cleaned = stripTypeAnnotations(raw)
    .replace(/^export\s+const\s+/gm, 'const ')
    .replace(/^export\s+default\s+/gm, 'module.exports = ');

  const fn = new Function('module', 'exports', cleaned + '\nreturn augmentations;');
  const mod = { exports: {} };
  const augs = fn(mod, mod.exports) as Record<string, unknown>[];

  return augs.map((a) => ({
    category: 'augmentation',
    name: a.name as string,
    description: (a.short as string) || (a.long as string) || '',
    metadata: a,
  }));
}

/**
 * Extract a top-level array or object literal assigned to a variable.
 * Matches: `const varName = [...]` or `const varName: Type[] = [...]`
 * Uses bracket counting to find the complete literal.
 */
function extractLiteral(src: string, varName: string): unknown {
  const pattern = new RegExp(`(?:const|let|var)\\s+${varName}[^=]*=\\s*`);
  const match = src.match(pattern);
  if (!match || match.index === undefined) return null;

  const startIdx = match.index + match[0].length;
  const openChar = src[startIdx];
  const closeChar = openChar === '[' ? ']' : openChar === '{' ? '}' : null;
  if (!closeChar) return null;

  let depth = 0;
  let inString: string | null = null;
  for (let i = startIdx; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === inString && src[i - 1] !== '\\') inString = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inString = ch; continue; }
    if (ch === openChar) depth++;
    if (ch === closeChar) depth--;
    if (depth === 0) {
      const literal = src.slice(startIdx, i + 1);
      // eval as JS (no TS syntax in data literals)
      return new Function(`return ${literal}`)();
    }
  }
  return null;
}

function flattenSleeves(): ImportItem[] {
  const raw = readFileSync(join(DATA_DIR, 'nova-praxis-sleeves.ts'), 'utf-8');
  const items: ImportItem[] = [];

  for (const varName of ['biosleeves', 'cybersleeves']) {
    try {
      const arr = extractLiteral(raw, varName) as Record<string, unknown>[];
      if (!arr) { console.warn(`  Sleeve var not found: ${varName}`); continue; }
      for (const s of arr) {
        items.push({
          category: 'sleeve',
          name: s.name as string,
          description: (s.description as string) || '',
          metadata: s,
        });
      }
    } catch (e) {
      console.warn(`  Skipping sleeve var: ${varName}`, (e as Error).message?.slice(0, 80));
    }
  }

  return items;
}

function flattenSkills(): ImportItem[] {
  const arr = evalDataFile('nova-praxis-skills.ts', 'skillsData') as Record<string, unknown>[];
  return arr.map((s) => ({
    category: 'skill',
    name: s.name as string,
    description: (s.description as string) || '',
    metadata: s,
  }));
}

function flattenStates(): ImportItem[] {
  const raw = readFileSync(join(DATA_DIR, 'nova-praxis-states.ts'), 'utf-8');
  const cleaned = stripTypeAnnotations(raw)
    .replace(/^export\s+default\s+/gm, 'module.exports = ')
    .replace(/^export\s+const\s+/gm, 'const ');

  const fn = new Function('module', 'exports', cleaned + '\nreturn states;');
  const mod = { exports: {} };
  const states = fn(mod, mod.exports) as Record<string, unknown>[];

  return states.map((s) => ({
    category: 'state',
    name: s.name as string,
    description: (s.description as string) || (s.short_description as string) || '',
    metadata: s,
  }));
}

function flattenHouses(): ImportItem[] {
  const arr = evalDataFile('nova-praxis-houses.ts', 'housesData') as Record<string, unknown>[];
  return arr.map((h) => ({
    category: 'house',
    name: h.name as string,
    description: (h.description as string) || (h.concise_summary as string) || '',
    metadata: h,
  }));
}

function flattenFateLadder(): ImportItem[] {
  const raw = readFileSync(join(DATA_DIR, 'fate-ladder.ts'), 'utf-8');
  const arr = extractLiteral(raw, 'fateLadder') as Record<string, unknown>[];
  if (!arr) return [];

  const items: ImportItem[] = arr.map((l) => ({
    category: 'fate_ladder',
    name: l.name as string,
    description: `+${l.value} ${l.adjective}`,
    metadata: l,
  }));

  // Also grab skillDistributions
  const dists = extractLiteral(raw, 'skillDistributions') as Record<string, Record<string, unknown>> | null;
  if (dists) {
    for (const [key, val] of Object.entries(dists)) {
      items.push({
        category: 'skill_distribution',
        name: val.name as string,
        description: (val.description as string) || '',
        metadata: { id: key, ...val },
      });
    }
  }

  return items;
}

async function main() {
  console.log('Importing game data...');
  await query('TRUNCATE game_data RESTART IDENTITY');

  const allItems: ImportItem[] = [];

  const loaders: [string, () => ImportItem[]][] = [
    ['gear', flattenGear],
    ['augmentations', flattenAugmentations],
    ['sleeves', flattenSleeves],
    ['skills', flattenSkills],
    ['states', flattenStates],
    ['houses', flattenHouses],
    ['fate_ladder', flattenFateLadder],
  ];

  for (const [label, loader] of loaders) {
    try {
      const items = loader();
      allItems.push(...items);
      console.log(`  ${label}: ${items.length} items`);
    } catch (err) {
      console.error(`  ERROR loading ${label}:`, err);
    }
  }

  for (const item of allItems) {
    await query(
      `INSERT INTO game_data (category, name, description, metadata)
       VALUES ($1, $2, $3, $4)`,
      [item.category, item.name, item.description, JSON.stringify(item.metadata)]
    );
  }

  console.log(`Total: ${allItems.length} game data rows imported`);
  await end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
