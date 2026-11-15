import type { Language } from '@/i18n/translations';
import type { CarbonResult } from '@/data/carbon';

export type Localized = Record<Language, string>;

export interface FormOption {
  id: string;
  text: Localized;
  points: number;
}

export interface FormQuestion {
  id: number;
  category: Localized;
  question: Localized;
  options: FormOption[];
  tip: Localized;
  impact: Localized;
}

export interface Level {
  min: number;
  key: string;
  name: Localized;
  description: Localized;
}

export interface Forms {
  questions: FormQuestion[];
  levels: Level[];
  maxPoints: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  language: Language;
  createdAt: string;
}

export interface QuestionnaireResult {
  id: number;
  answers: Record<string, string>;
  language: Language;
  score: number;
  level: string;
  aiResponse: Partial<Record<Language, string>> | null;
  carbonInputs: Record<string, unknown> | null;
  carbonResult: CarbonResult | null;
  footprintKg: number | null;
  profile: string | null;
  userId: number | null;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
