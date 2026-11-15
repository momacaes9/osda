import { Injectable, Logger } from '@nestjs/common';
import { generateText as aiGenerateText, type ModelMessage } from 'ai';
import { QuestionnaireService } from '../questionnaire/questionnaire.service.js';
import { forms, levels, type Language } from '../../data/forms.js';
import { offlineChatAnswer, offlineQuestionnaireAnswer } from './offline.js';
import { buildProviderChain, isQuotaError, toPlainText, type AiProvider } from './providers.js';

export interface QuestionnaireAnswer {
  questionId: number;
  answer: string;
}

export interface FormattedAnswer {
  question: string;
  answer: string;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface RunInput {
  instructions: string;
  timeoutMs?: number;
  prompt?: string;
  messages?: ChatMessage[];
}

const COOLDOWN_QUOTA_MS = 15 * 60 * 1000; // out of credits / rate limited
const COOLDOWN_ERROR_MS = 30 * 1000; // other failures (slow answers / timeouts are NOT cooled down)
const CHAT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 35_000;
const ANALYSIS_TIMEOUT_MS = Number(process.env.AI_ANALYSIS_TIMEOUT_MS) || 60_000;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly chain: AiProvider[];
  /** provider key -> timestamp until which it is skipped */
  private readonly cooldown = new Map<string, number>();
  private lastUsed: string | null = null;

  constructor(private readonly questionnaireService: QuestionnaireService) {
    this.chain = buildProviderChain();
    this.logger.log(
      `AI chain: ${this.chain.map((p) => `${p.name}:${p.model}`).join(' → ') || '(none)'} → offline`,
    );
  }

  get status() {
    const now = Date.now();
    return {
      mode: this.chain.length ? 'online' : 'offline',
      lastUsed: this.lastUsed,
      chain: [
        ...this.chain.map((p) => ({
          provider: p.name,
          model: p.model,
          available: (this.cooldown.get(this.key(p)) ?? 0) <= now,
        })),
        { provider: 'offline', model: 'built-in', available: true },
      ],
    };
  }

  private key(p: AiProvider) {
    return `${p.name}:${p.model}`;
  }

  /** Tries each model in order; skips ones cooling down; returns null if all fail. */
  private async run(input: RunInput): Promise<string | null> {
    const now = Date.now();
    for (const provider of this.chain) {
      const key = this.key(provider);
      if ((this.cooldown.get(key) ?? 0) > now) continue;
      try {
        const result = await aiGenerateText({
          model: provider.instance,
          instructions: input.instructions,
          ...(input.messages
            ? { messages: input.messages as ModelMessage[] }
            : { prompt: input.prompt ?? '' }),
          maxRetries: 0,
          abortSignal: AbortSignal.timeout(input.timeoutMs ?? CHAT_TIMEOUT_MS),
        });
        const text = toPlainText(result.text ?? '');
        if (!text) throw new Error('Empty response');
        this.cooldown.delete(key);
        this.lastUsed = key;
        return text;
      } catch (error) {
        const quota = isQuotaError(error);
        const timedOut = /abort|timeout/i.test(String((error as Error)?.name) + (error as Error)?.message);
        if (!timedOut) {
          this.cooldown.set(key, Date.now() + (quota ? COOLDOWN_QUOTA_MS : COOLDOWN_ERROR_MS));
        }
        this.logger.warn(
          `AI ${key} failed (${quota ? 'quota/limit' : timedOut ? 'timeout' : 'error'}): ${(error as Error).message?.slice(0, 160)} — trying next model`,
        );
      }
    }
    this.lastUsed = 'offline';
    return null;
  }

  async generateText(text: string, systemPrompt: string): Promise<string> {
    return (
      (await this.run({ instructions: systemPrompt, prompt: text })) ??
      offlineChatAnswer([{ role: 'user', content: text }], 'en')
    );
  }

  async generateChatMessage(
    messages: ChatMessage[],
    systemPrompt: string,
    language: Language = 'en',
  ): Promise<string> {
    return (
      (await this.run({ instructions: systemPrompt, messages })) ??
      offlineChatAnswer(messages, language)
    );
  }

  async GenerateQuestionnaireTextResponse(
    questionnaireID: number,
    language: Language = 'en',
    userId?: number,
  ): Promise<string> {
    const questionnaire = await this.questionnaireService.findVisible(questionnaireID, userId);

    const cached = questionnaire.aiResponse?.[language];
    if (cached) return cached;

    const answersArray: QuestionnaireAnswer[] = Object.entries(questionnaire.answers).map(
      ([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: answer,
      }),
    );

    const formattedAnswers: FormattedAnswer[] = answersArray.map((answer) => {
      const question = forms.find((q) => q.id === answer.questionId);
      const selectedOption = question?.options.find((opt) => opt.id === answer.answer);
      return {
        question: question?.question[language] || '',
        answer: selectedOption?.text[language] || '',
      };
    });

    const level = levels.find((l) => l.key === questionnaire.level);
    const languageName = language === 'pt' ? 'Brazilian Portuguese' : 'English';
    const systemPrompt =
      `You are an environmental sustainability expert. Analyze the following questionnaire answers ` +
      `and provide personalized, practical and encouraging recommendations. ` +
      `The user's sustainability score is ${questionnaire.score}/100 (level: ${level?.name[language]}). ` +
      `Structure: one short opening sentence about their profile, then 3 to 5 numbered recommendations ` +
      `focused on the weakest habits, each with an estimated environmental impact, then one motivating closing line. ` +
      `Use a few emojis. Keep it under 250 words. Write in plain text without markdown formatting. Answer ONLY in ${languageName}.`;

    const response = await this.run({
      instructions: systemPrompt,
      prompt: JSON.stringify(formattedAnswers),
      timeoutMs: ANALYSIS_TIMEOUT_MS,
    });

    if (!response) {
      // Don't cache the offline text, so a real AI analysis is generated once a model is available again
      return offlineQuestionnaireAnswer(questionnaire.answers, questionnaire.score, language);
    }

    await this.questionnaireService.saveAiResponse(questionnaire.id, language, response);
    return response;
  }
}
