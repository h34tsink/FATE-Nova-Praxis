import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

async function callOllama(
  system: string,
  prompt: string,
  maxTokens = 2048
): Promise<ApiResult> {
  const { baseUrl, model } = config.ollama;
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      options: { num_predict: maxTokens, temperature: 0.7 },
    }),
  });

  if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
  const data = await response.json();
  const output = data.message?.content ?? '';
  return { output, model, inputTokens: 0, outputTokens: 0 };
}

const client = new Anthropic({ apiKey: config.anthropic.apiKey });

export type ModelTier = 'fast' | 'quality';

const MODELS: Record<ModelTier, string> = {
  fast: 'claude-haiku-4-5-20251001',
  quality: 'claude-sonnet-4-6',
};

const SYSTEM_PROMPT = `You are a Nova Praxis TTRPG assistant embedded in a Discord bot. You respond to GM and player queries about rules, NPCs, scenes, and game state. Be concise and format for Discord (bold, italic, code blocks, blockquotes). Follow the nova-praxis-gm plugin command formats when instructed.`;

export interface ApiResult {
  output: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export async function callApi(
  prompt: string,
  tier: ModelTier = 'quality',
  maxTokens = 2048
): Promise<ApiResult> {
  if (!config.anthropic.apiKey) {
    return callOllama(SYSTEM_PROMPT, prompt, maxTokens);
  }

  const model = MODELS[tier];

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  });

  const output = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return {
    output,
    model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}

/**
 * Use Haiku to expand a user question into multiple search terms.
 * Returns an array of short phrases optimized for tsvector matching.
 */
export async function extractSearchTerms(question: string): Promise<string[]> {
  if (!config.anthropic.apiKey) {
    // Simple fallback: split on common words and return meaningful tokens
    return question
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['what', 'does', 'when', 'how', 'the', 'and', 'for'].includes(w))
      .slice(0, 5);
  }

  const response = await client.messages.create({
    model: MODELS.fast,
    max_tokens: 150,
    system: `You expand TTRPG questions into search keywords for a PostgreSQL full-text index. The index contains Nova Praxis (FATE-based) rules sections with headings like: Conflict and Health, Extended Actions, Skills, Augmentations, Sleeves, Stunts, Stress, Consequences, Movement, Blocks, Resleeving, Economy, Savant Programs, Drones, Mnemonic Editing, Gameplay, Armor, Firearms, Melee, Explosives, Equipment.

Return 3-5 short search phrases, one per line, no bullets or numbering. Include the original term plus related FATE/Nova Praxis mechanical terms.`,
    messages: [{ role: 'user', content: question }],
  });

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}
