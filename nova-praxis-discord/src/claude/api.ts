import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';

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
