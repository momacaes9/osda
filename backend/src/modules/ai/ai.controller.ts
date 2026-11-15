import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiService, type ChatMessage } from './ai.service.js';
import { OptionalJwtAuthenticationGuard } from '../../auth/userJwtAuthentication.guard.js';
import { CurrentUser } from '../../auth/currentUser.decorator.js';
import type { AuthenticatedUser } from '../../auth/jwtPayload.js';
import type { Language } from '../../data/forms.js';

const lang = (l?: string): Language => (l === 'pt' ? 'pt' : 'en');

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new BadRequestException('messages must be a non-empty array');
  }
  return messages.slice(-20).map((m) => {
    const role = m?.role === 'assistant' ? 'assistant' : 'user';
    const content = typeof m?.content === 'string' ? m.content.slice(0, 2000) : '';
    if (!content.trim()) throw new BadRequestException('Empty message');
    return { role, content };
  });
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('status')
  status() {
    return this.aiService.status;
  }

  @Post('generate-text')
  async generateText(@Body() body: { text: string }) {
    if (typeof body?.text !== 'string' || !body.text.trim()) {
      throw new BadRequestException('text is required');
    }
    const systemPrompt = 'You are a helpful assistant that can answer questions and help with tasks.';
    return { answer: await this.aiService.generateText(body.text.slice(0, 4000), systemPrompt) };
  }

  @Post('generate-chat-message')
  async generateChatMessage(@Body() body: { messages: ChatMessage[]; language?: string }) {
    const language = lang(body?.language);
    const systemPrompt =
      'You are OSDA (One Step Drives All), a helpful sustainability assistant that can answer questions regarding ' +
      'environmental issues and help with sustainability related tasks. Use emojis to make the answer more engaging. ' +
      'Keep answers short (under 150 words) and practical. Write in plain text without using any tool calls or markdown formatting. ' +
      `Reply in ${language === 'pt' ? 'Brazilian Portuguese' : 'English'} unless the user clearly writes in another language. ` +
      'If the user asks about something unrelated to sustainability, kindly steer the conversation back to sustainability.';
    const answer = await this.aiService.generateChatMessage(
      sanitizeMessages(body?.messages),
      systemPrompt,
      language,
    );
    return {
      answer: answer,
    };
  }

  @Post('generate-questionnaire-text-response')
  @UseGuards(OptionalJwtAuthenticationGuard)
  async generateQuestionnaireTextResponse(
    @Body() body: { questionnaireID: number; language?: string },
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const id = Number(body?.questionnaireID);
    if (!Number.isInteger(id)) throw new BadRequestException('questionnaireID is required');
    const answer = await this.aiService.GenerateQuestionnaireTextResponse(id, lang(body.language), user?.userId);
    return {
      answer: answer,
    };
  }
}
