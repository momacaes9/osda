import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsObject, IsOptional } from 'class-validator';
import { QuestionnaireService } from './questionnaire.service.js';
import { forms, levels, MAX_POINTS } from '../../data/forms.js';
import { DEFAULT_CARBON_INPUTS, LIMITS, REFERENCES } from '../../data/carbon.js';
import {
  OptionalJwtAuthenticationGuard,
  UserJwtAuthenticationGuard,
} from '../../auth/userJwtAuthentication.guard.js';
import { CurrentUser } from '../../auth/currentUser.decorator.js';
import type { AuthenticatedUser } from '../../auth/jwtPayload.js';

class CreateQuestionnaireInput {
  @IsObject()
  answers: Record<string, string>;

  @IsOptional()
  @IsIn(['en', 'pt'])
  language?: string;

  @IsOptional()
  @IsObject()
  carbon?: Record<string, unknown>;
}

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  /** Questions, options, tips and levels in EN + PT. */
  @Get('forms')
  getForms() {
    return { questions: forms, levels, maxPoints: MAX_POINTS, carbon: { defaults: DEFAULT_CARBON_INPUTS, limits: LIMITS, references: REFERENCES } };
  }

  @Post()
  @UseGuards(OptionalJwtAuthenticationGuard)
  create(@Body() body: CreateQuestionnaireInput, @CurrentUser() user?: AuthenticatedUser) {
    return this.questionnaireService.create(body.answers, body.language ?? 'en', user?.userId ?? null, body.carbon ?? null);
  }

  @Get('mine')
  @UseGuards(UserJwtAuthenticationGuard)
  mine(@CurrentUser() user: AuthenticatedUser) {
    return this.questionnaireService.findByUser(user.userId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthenticationGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user?: AuthenticatedUser) {
    return this.questionnaireService.findVisible(id, user?.userId);
  }
}
