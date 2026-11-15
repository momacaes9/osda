import { Module } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { AiController } from './ai.controller.js';
import { QuestionnaireModule } from '../questionnaire/questionnaire.module.js';

@Module({
  imports: [QuestionnaireModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
