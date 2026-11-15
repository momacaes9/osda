import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateText as aiGenerateText, type LanguageModel, type ModelMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { EnvironmentVariables } from '../../config/environmentVariables.js';
import { QuestionnaireService } from '../questionnaire/questionnaire.service.js';
import { forms, levels, type Language } from '../../data/forms.js';
import { offlineChatAnswer, offlineQuestionnaireAnswer } from './offline.js';

export interface QuestionnaireAnswer {
  questionId: number;
  answer: string;
}

export interface FormattedAnswer {
  question: string;
  answer: string;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

type ProviderMode = 'gateway' | 'openai-compatible' | 'offline';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly mode: ProviderMode;
  private readonly model: LanguageModel | null;
  readonly modelName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly questionnaireService: QuestionnaireService,
  ) {
    const get = (k: EnvironmentVariables) => this.configService.get<string>(k)?.trim() || undefined;
    const gatewayKey = get(EnvironmentVariables.AI_GATEWAY_API_KEY) || process.env.VERCEL_OIDC_TOKEN;
    const apiKey = get(EnvironmentVariables.AI_API_KEY) || get(EnvironmentVariables.OPENAI_API_KEY);
    const baseURL = get(EnvironmentVariables.AI_BASE_URL);
    const configuredModel = get(EnvironmentVariables.AI_MODEL);

    if (apiKey) {
      // OpenAI or any OpenAI-compatible free API (Groq, OpenRouter, Gemini, Ollama...)
      this.mode = 'openai-compatible';
      this.modelName = configuredModel || 'gpt-4.1-nano';
      const provider = createOpenAI({ apiKey, baseURL });
      this.model = baseURL ? provider.chat(this.modelName) : provider(this.modelName);
    } else if (gatewayKey) {
      // Vercel AI Gateway: plain "provider/model" string
      this.mode = 'gateway';
      this.modelName = configuredModel || 'openai/gpt-4.1-nano';
      this.model = this.modelName;
    } else {
      this.mode = 'offline';
      this.modelName = 'offline';
      this.model = null;
      this.logger.warn('No AI key configured — using the built-in offline assistant.');
    }
    this.logger.log(`AI provider: ${this.mode} (${this.modelName})`);
  }

  get status() {
    return { mode: this.mode, model: this.modelName };
  }

  async generateText(text: string, systemPrompt: string): Promise<string> {
    if (!this.model) return offlineChatAnswer([{ role: 'user', content: text }], 'en');
    const response = await aiGenerateText({
      model: this.model,
      instructions: systemPrompt,
      prompt: text,
    });
    return response.text;
  }

  async generateChatMessage(
    messages: ChatMessage[],
    systemPrompt: string,
    language: Language = 'en',
  ): Promise<string> {
    if (!this.model) return offlineChatAnswer(messages, language);
    try {
      const response = await aiGenerateText({
        model: this.model,
        messages: messages as ModelMessage[],
        instructions: systemPrompt,
      });
      return response.text;
    } catch (error) {
      this.logger.error(`AI chat failed: ${(error as Error).message}`);
      return offlineChatAnswer(messages, language);
    }
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
      `Use a few emojis. Write in plain text without markdown formatting. Answer ONLY in ${languageName}.`;

    let response: string;
    if (!this.model) {
      response = offlineQuestionnaireAnswer(questionnaire.answers, questionnaire.score, language);
    } else {
      try {
        response = await this.generateText(JSON.stringify(formattedAnswers), systemPrompt);
      } catch (error) {
        this.logger.error(`AI questionnaire analysis failed: ${(error as Error).message}`);
        return offlineQuestionnaireAnswer(questionnaire.answers, questionnaire.score, language);
      }
    }

    await this.questionnaireService.saveAiResponse(questionnaire.id, language, response);
    return response;
  }
}
