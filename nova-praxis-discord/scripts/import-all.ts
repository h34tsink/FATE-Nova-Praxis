import { execSync } from 'child_process';

const scripts = [
  'import-game-data.ts',
  'import-glossary.ts',
  'import-rules.ts',
  'import-entities.ts',
  'import-characters.ts',
  'import-sessions.ts',
];

for (const script of scripts) {
  console.log(`\n=== Running ${script} ===`);
  try {
    execSync(`npx tsx scripts/${script}`, { stdio: 'inherit', cwd: import.meta.dirname + '/..' });
  } catch (err) {
    console.error(`FAILED: ${script}`);
    process.exit(1);
  }
}

console.log('\n=== All imports complete ===');
