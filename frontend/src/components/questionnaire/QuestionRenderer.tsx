import { useQuestionnaire } from './QuestionnaireManager';
import { useLanguage } from '@/i18n/LanguageContext';

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
    setPhase,
  } = useQuestionnaire();
  const { t, language } = useLanguage();

  const question = questions[currentQuestion];
  const selected = answers[question.id];
  const progress = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  const choose = (optionId: string) => {
    setAnswer(question.id, optionId);
    if (!isLastQuestion) setTimeout(goToNextQuestion, 250);
  };

  const finish = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPhase('carbon');
  };

  return (
    <>
    <div className="part-label"><span>{t.calc.part1}</span><span>1 / 2</span></div>
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

      <div className="question-nav">
        <button className="btn btn-ghost" onClick={goToPreviousQuestion} disabled={isFirstQuestion}>
          ‹ {t.q.previous}
        </button>
        {isLastQuestion ? (
          <button
            className="btn btn-primary"
            onClick={finish}
            disabled={Object.keys(answers).length < totalQuestions}
          >
            {t.q.next} ›
          </button>
        ) : (
          <button className="btn btn-primary" onClick={goToNextQuestion} disabled={!selected}>
            {t.q.next} ›
          </button>
        )}
      </div>
    </div>
    </>
  );
}
