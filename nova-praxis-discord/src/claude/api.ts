import { config } from '../config.js';

export type ModelTier = 'fast' | 'quality';

export interface ApiResult {
  output: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

const SYSTEM_PROMPT = `You are a Nova Praxis TTRPG assistant embedded in a Discord bot. You respond to GM and player queries about rules, NPCs, scenes, and game state. Be concise and format for Discord (bold, italic, code blocks, blockquotes).`;

const TIER_OPTIONS: Record<ModelTier, { num_predict: number; temperature: number; num_ctx: number }> = {
  fast:    { num_predict: 1024,  temperature: 0.4, num_ctx: 8192  },
  quality: { num_predict: 2048,  temperature: 0.7, num_ctx: 16384 },
};

async function chat(
  system: string,
  user: string,
  options: Record<string, unknown>
): Promise<{ content: string; promptTokens: number; completionTokens: number }> {
  const { baseUrl, model } = config.ollama;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
      options: { flash_attn: true, think: false, ...options },
    }),
  });

  if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);

  const data = await response.json();
  return {
    content:          data.message?.content ?? '',
    promptTokens:     data.prompt_eval_count ?? 0,
    completionTokens: data.eval_count ?? 0,
  };
}

export async function callApi(
  prompt: string,
  tier: ModelTier = 'quality',
  maxTokens?: number
): Promise<ApiResult> {
  const opts = { ...TIER_OPTIONS[tier] };
  if (maxTokens) opts.num_predict = maxTokens;

  const { content, promptTokens, completionTokens } = await chat(SYSTEM_PROMPT, prompt, opts);

  return {
    output:      content,
    model:       config.ollama.model,
    inputTokens: promptTokens,
    outputTokens: completionTokens,
  };
}

export async function streamApi(
  prompt: string,
  tier: ModelTier = 'quality',
  maxTokens: number | undefined,
  onUpdate: (text: string) => Promise<void>
): Promise<ApiResult> {
  const { baseUrl, model } = config.ollama;
  const opts = { ...TIER_OPTIONS[tier] };
  if (maxTokens) opts.num_predict = maxTokens;

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: prompt         },
      ],
      options: { flash_attn: true, think: false, ...opts },
    }),
  });

  if (!response.ok) throw new Error(`Ollama ${response.status}: ${await response.text()}`);

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let lastUpdate = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.message?.content) fullText += data.message.content as string;
        } catch { /* skip malformed */ }
      }

      const now = Date.now();
      if (fullText && now - lastUpdate >= 1000) {
        await onUpdate(fullText).catch(() => {});
        lastUpdate = now;
      }
    }
  } finally {
    reader.releaseLock();
  }

  await onUpdate(fullText).catch(() => {});
  return { output: fullText, model, inputTokens: 0, outputTokens: 0 };
}

export async function extractSearchTerms(question: string): Promise<string[]> {
  const { content } = await chat(
    `Expand this TTRPG question into 3-5 short search phrases for a PostgreSQL full-text index of Nova Praxis (FATE) rules. Sections include: Conflict and Health, Extended Actions, Skills, Augmentations, Sleeves, Stunts, Stress, Consequences, Resleeving, Savant Programs, Drones, Mnemonic Editing, Armor, Firearms, Melee, Explosives, Equipment. Reply with ONLY the phrases, one per line, no bullets.`,
    question,
    { num_predict: 100, temperature: 0.2, num_ctx: 2048 }
  );

  return content.split('\n').map((s: string) => s.trim()).filter(Boolean);
}
