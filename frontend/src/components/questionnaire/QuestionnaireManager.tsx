import { createContext, useContext, useState, type ReactNode } from 'react';
import type { FormQuestion } from '@/services/types';
import { DEFAULT_CARBON_INPUTS, type CarbonInputs } from '@/data/carbon';

interface QuestionnaireContextType {
  questions: FormQuestion[];
  currentQuestion: number;
  answers: Record<number, string>;
  totalQuestions: number;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setAnswer: (questionId: number, answer: string) => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
  phase: 'habits' | 'carbon';
  setPhase: (p: 'habits' | 'carbon') => void;
  carbon: CarbonInputs;
  setCarbon: <K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}

interface QuestionnaireManagerProps {
  questions: FormQuestion[];
  children: ReactNode;
}

export function QuestionnaireManager({ questions, children }: QuestionnaireManagerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const totalQuestions = questions.length;
  const [phase, setPhase] = useState<'habits' | 'carbon'>('habits');
  const [carbon, setCarbonState] = useState<CarbonInputs>(DEFAULT_CARBON_INPUTS);
  const setCarbon = <K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) =>
    setCarbonState((prev) => ({ ...prev, [key]: value }));

  const goToNextQuestion = () => setCurrentQuestion((q) => Math.min(q + 1, totalQuestions - 1));
  const goToPreviousQuestion = () => setCurrentQuestion((q) => Math.max(q - 1, 0));
  const setAnswer = (questionId: number, answer: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

  return (
    <QuestionnaireContext.Provider
      value={{
        questions,
        currentQuestion,
        answers,
        totalQuestions,
        goToNextQuestion,
        goToPreviousQuestion,
        setAnswer,
        isLastQuestion: currentQuestion === totalQuestions - 1,
        isFirstQuestion: currentQuestion === 0,
        phase,
        setPhase,
        carbon,
        setCarbon,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}
