import { api } from './api';
import type { Forms, QuestionnaireResult } from './types';

let formsCache: Promise<Forms> | null = null;

export const QuestionnaireService = {
  getForms() {
    formsCache ??= api<Forms>('/questionnaire/forms').catch((e) => {
      formsCache = null;
      throw e;
    });
    return formsCache;
  },
  submit(answers: Record<number, string>, language: string) {
    return api<QuestionnaireResult>('/questionnaire', {
      method: 'POST',
      body: JSON.stringify({ answers, language }),
    });
  },
  get(id: number) {
    return api<QuestionnaireResult>(`/questionnaire/${id}`);
  },
  mine() {
    return api<QuestionnaireResult[]>('/questionnaire/mine');
  },
};
