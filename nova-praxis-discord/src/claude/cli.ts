import { spawn } from 'child_process';
import { config } from '../config.js';

export interface ClaudeResult {
  output: string;
  exitCode: number;
}

export async function callClaude(prompt: string, timeoutMs = 60_000): Promise<ClaudeResult> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['--print', '--dangerously-skip-permissions'], {
      cwd: config.vaultPath,
      shell: true,
      timeout: timeoutMs,
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
      } else {
        resolve({ output: stdout.trim(), exitCode: code ?? 0 });
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn Claude CLI: ${err.message}`));
    });

    // Send prompt via stdin
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}
