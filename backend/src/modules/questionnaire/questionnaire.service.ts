import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire } from './questionnaire.entity.js';
import { forms, scoreAnswers } from '../../data/forms.js';
import { calculateCarbon, sanitizeCarbonInputs } from '../../data/carbon.js';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire)
    private readonly repository: Repository<Questionnaire>,
  ) {}

  async create(
    answers: Record<string, string>,
    language: string,
    userId: number | null,
    carbon?: Record<string, unknown> | null,
  ): Promise<Questionnaire> {
    const clean: Record<string, string> = {};
    for (const q of forms) {
      const value = answers?.[String(q.id)];
      if (!q.options.some((o) => o.id === value)) {
        throw new BadRequestException(`Missing or invalid answer for question ${q.id}`);
      }
      clean[String(q.id)] = value;
    }
    const { score, level } = scoreAnswers(clean);
    const carbonInputs = carbon ? sanitizeCarbonInputs(carbon) : null;
    const carbonResult = carbonInputs ? calculateCarbon(carbonInputs, clean['4']) : null;
    const entity = this.repository.create({
      answers: clean,
      language: language === 'pt' ? 'pt' : 'en',
      score,
      level,
      userId,
      aiResponse: null,
      carbonInputs: carbonInputs as Record<string, unknown> | null,
      carbonResult: carbonResult as unknown as Record<string, unknown> | null,
      footprintKg: carbonResult?.totalKg ?? null,
      profile: carbonResult?.profile ?? null,
    });
    return this.repository.save(entity);
  }

  async findOne(id: number): Promise<Questionnaire | null> {
    return this.repository.findOne({ where: { id } });
  }

  /** Loads a questionnaire and checks the caller may see it. */
  async findVisible(id: number, userId?: number): Promise<Questionnaire> {
    const questionnaire = await this.findOne(id);
    if (!questionnaire) throw new NotFoundException('Questionnaire not found');
    if (questionnaire.userId && questionnaire.userId !== userId) {
      throw new ForbiddenException('This questionnaire belongs to another user');
    }
    return questionnaire;
  }

  findByUser(userId: number): Promise<Questionnaire[]> {
    return this.repository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async saveAiResponse(id: number, language: string, text: string): Promise<void> {
    const q = await this.findOne(id);
    if (!q) return;
    q.aiResponse = { ...(q.aiResponse ?? {}), [language]: text };
    await this.repository.save(q);
  }
}
