import { api } from './api';
import type { ChatMessage } from './types';

export const aiService = {
  async chat(messages: ChatMessage[], language: string) {
    const data = await api<{ answer: string }>('/ai/generate-chat-message', {
      method: 'POST',
      body: JSON.stringify({ messages, language }),
    });
    return data.answer;
  },
  async questionnaireAnalysis(questionnaireID: number, language: string) {
    const data = await api<{ answer: string }>('/ai/generate-questionnaire-text-response', {
      method: 'POST',
      body: JSON.stringify({ questionnaireID, language }),
    });
    return data.answer;
  },
};
