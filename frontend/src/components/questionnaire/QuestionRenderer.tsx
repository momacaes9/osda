import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from './QuestionnaireManager';
import { useLanguage } from '@/i18n/LanguageContext';
import { QuestionnaireService } from '@/services/questionnaireService';

export function QuestionRenderer() {
  const {
    questions,
    currentQuestion,
    answers,
    totalQuestions,
    goToNextQuestion,
    goToPreviousQuestion,
    setAnswer,
    isFirstQuestion,
    isLastQuestion,
  } = useQuestionnaire();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = questions[currentQuestion];
  const selected = answers[question.id];
  const progress = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  const choose = (optionId: string) => {
    setAnswer(question.id, optionId);
    if (!isLastQuestion) setTimeout(goToNextQuestion, 250);
  };

  const finish = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await QuestionnaireService.submit(answers, language);
      navigate(`/questionnaire-answer/${result.id}`);
    } catch (e) {
      setError((e as Error).message || t.errors.generic);
      setSaving(false);
    }
  };

  return (
    <div className="card question-card">
      <span className="badge">{question.category[language]}</span>
      <h2 className="question-title">{question.question[language]}</h2>

      <div className="options" role="radiogroup" aria-label={question.question[language]}>
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`option ${isSelected ? 'selected' : ''}`}
              onClick={() => choose(option.id)}
            >
              <span>{option.text[language]}</span>
              <span className="radio" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="progress-meta">
        <span className="accent">
          {t.q.question} {currentQuestion + 1} {t.q.of} {totalQuestions}
        </span>
        <span className="muted">{progress}% {t.q.complete}</span>
      </div>
      <div className="progress" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="question-nav">
        <button className="btn btn-ghost" onClick={goToPreviousQuestion} disabled={isFirstQuestion}>
          ‹ {t.q.previous}
        </button>
        {isLastQuestion ? (
          <button
            className="btn btn-primary"
            onClick={finish}
            disabled={saving || Object.keys(answers).length < totalQuestions}
          >
            {saving ? t.q.saving : t.q.finish}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={goToNextQuestion} disabled={!selected}>
            {t.q.next} ›
          </button>
        )}
      </div>
    </div>
  );
}
