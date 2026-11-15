import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaire } from './questionnaire.entity.js';
import { QuestionnaireService } from './questionnaire.service.js';
import { QuestionnaireController } from './questionnaire.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire])],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
