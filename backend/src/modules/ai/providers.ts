import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';

/**
 * Ordered list of AI models. The app tries them in order and automatically
 * moves to the next one when a provider fails, hits a rate limit or runs out
 * of credits. Every provider below is optional except the keyless free one.
 */
export interface AiProvider {
  name: string;
  model: string;
  instance: LanguageModel;
}

const env = (k: string) => process.env[k]?.trim() || undefined;

function openAiCompatible(name: string, apiKey: string, baseURL: string | undefined, models: string[]): AiProvider[] {
  const provider = createOpenAI({ apiKey, baseURL, name });
  return models.map((model) => ({
    name,
    model,
    instance: baseURL ? provider.chat(model) : provider(model),
  }));
}

const list = (value: string | undefined, fallback: string[]) =>
  value ? value.split(',').map((m) => m.trim()).filter(Boolean) : fallback;

export function buildProviderChain(): AiProvider[] {
  const chain: AiProvider[] = [];

  // 1. Custom / OpenAI (ChatGPT) — AI_API_KEY (+ optional AI_BASE_URL) or OPENAI_API_KEY
  const customKey = env('AI_API_KEY') || env('OPENAI_API_KEY');
  if (customKey) {
    chain.push(
      ...openAiCompatible(
        env('AI_BASE_URL') ? 'custom' : 'openai',
        customKey,
        env('AI_BASE_URL'),
        list(env('AI_MODEL'), ['gpt-4.1-nano']),
      ),
    );
  }

  // 2. Groq — free tier (https://console.groq.com/keys)
  const groq = env('GROQ_API_KEY');
  if (groq) {
    chain.push(
      ...openAiCompatible('groq', groq, 'https://api.groq.com/openai/v1',
        list(env('GROQ_MODELS'), ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'])),
    );
  }

  // 3. Google Gemini — free tier (https://aistudio.google.com/apikey)
  const gemini = env('GEMINI_API_KEY');
  if (gemini) {
    chain.push(
      ...openAiCompatible('gemini', gemini, 'https://generativelanguage.googleapis.com/v1beta/openai',
        list(env('GEMINI_MODELS'), ['gemini-2.5-flash', 'gemini-2.5-flash-lite'])),
    );
  }

  // 4. OpenRouter — free models (https://openrouter.ai/keys)
  const openrouter = env('OPENROUTER_API_KEY');
  if (openrouter) {
    chain.push(
      ...openAiCompatible('openrouter', openrouter, 'https://openrouter.ai/api/v1',
        list(env('OPENROUTER_MODELS'), ['meta-llama/llama-3.3-70b-instruct:free', 'openrouter/free'])),
    );
  }

  // 5. Vercel AI Gateway — plain "provider/model" strings
  if (env('AI_GATEWAY_API_KEY')) {
    for (const model of list(env('AI_GATEWAY_MODELS'), ['openai/gpt-4.1-nano', 'google/gemini-2.5-flash-lite'])) {
      chain.push({ name: 'vercel-gateway', model, instance: model });
    }
  }

  // 6. Pollinations — free, NO key needed. Always available as the last online fallback.
  if (env('AI_DISABLE_KEYLESS') !== 'true') {
    chain.push(
      ...openAiCompatible('pollinations', env('POLLINATIONS_API_KEY') || 'free', 'https://text.pollinations.ai/openai',
        list(env('POLLINATIONS_MODELS'), ['openai'])),
    );
  }

  return chain;
}

/** Errors that mean "this provider can't serve us right now" → cool it down for a while. */
export function isQuotaError(error: unknown): boolean {
  const e = error as { statusCode?: number; status?: number; message?: string };
  const status = e?.statusCode ?? e?.status;
  if (status === 401 || status === 402 || status === 403 || status === 429) return true;
  return /quota|credit|rate.?limit|insufficient|billing|exceeded|too many requests/i.test(e?.message ?? '');
}

/** Models often answer in markdown even when asked not to — keep the chat clean. */
export function toPlainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
