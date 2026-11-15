import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QuestionnaireService } from '@/services/questionnaireService';
import { aiService } from '@/services/aiService';
import { useLanguage } from '@/i18n/LanguageContext';
import { askChat } from '@/components/ChatBot';
import { CarbonResultView } from '@/components/CarbonResultView';
import { IconSpark } from '@/components/Icons';
import type { Forms, QuestionnaireResult } from '@/services/types';

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 128 128" className="score-ring" aria-hidden="true">
      <circle cx="64" cy="64" r={r} className="ring-bg" />
      <circle
        cx="64"
        cy="64"
        r={r}
        className="ring-fg"
        strokeDasharray={c}
        strokeDashoffset={c - (score / 100) * c}
      />
    </svg>
  );
}

export function QuestionnaireAnswerPage() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [forms, setForms] = useState<Forms | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ai, setAi] = useState<{ lang: string; text: string } | null>(null);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    Promise.all([QuestionnaireService.get(Number(id)), QuestionnaireService.getForms()])
      .then(([r, f]) => {
        setResult(r);
        setForms(f);
      })
      .catch((e) => setError(e.message || t.result.notFound));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!result) return;
    let cancelled = false;
    setAiError(false);
    aiService
      .questionnaireAnalysis(result.id, language)
      .then((text) => !cancelled && setAi({ lang: language, text }))
      .catch(() => !cancelled && setAiError(true));
    return () => {
      cancelled = true;
    };
  }, [result, language]);

  if (error) {
    return (
      <section className="section page-center">
        <div className="card center">
          <p>{error}</p>
          <Link to="/questionnaire" className="btn btn-primary">{t.result.retake}</Link>
        </div>
      </section>
    );
  }

  if (!result || !forms) {
    return (
      <section className="section page-center">
        <div className="spinner" aria-label="Loading" />
      </section>
    );
  }

  const level = forms.levels.find((l) => l.key === result.level);
  const tips = forms.questions
    .map((q) => ({ q, points: q.options.find((o) => o.id === result.answers[String(q.id)])?.points ?? 0 }))
    .filter((x) => x.points < 3)
    .sort((a, b) => a.points - b.points)
    .slice(0, 5);

  const aiText = ai?.lang === language ? ai.text : null;

  return (
    <section className="section">
      <div className="container narrow">
        <div className="card result-hero">
          <h1>{t.result.title}</h1>
          <p className="muted">{t.result.scoreLabel}</p>
          <div className="score">
            <ScoreRing score={result.score} />
            <div className="score-text">
              <strong>{result.score}</strong>
              <span>{t.result.of100}</span>
            </div>
          </div>
          <span className="badge badge-lg">{level?.name[language]}</span>
          <p className="level-desc">{level?.description[language]}</p>
        </div>

        {result.carbonResult && <CarbonResultView result={result.carbonResult} />}

        <div className="card ai-card">
          <h2><IconSpark size={22} /> {t.result.aiTitle}</h2>
          {aiText ? (
            <p className="ai-text">{aiText}</p>
          ) : aiError ? (
            <p className="form-error">{t.result.aiError}</p>
          ) : (
            <div className="ai-loading"><div className="spinner small" /> {t.result.aiLoading}</div>
          )}
          <button
            className="btn btn-outline"
            onClick={() =>
              askChat(
                language === 'pt'
                  ? `Minha pontuação de sustentabilidade foi ${result.score}/100 (${level?.name.pt})${result.footprintKg ? ` e minha pegada é ${(result.footprintKg / 1000).toFixed(1)} t CO2e/ano` : ''}. Qual a primeira mudança que você recomenda?`
                  : `My sustainability score was ${result.score}/100 (${level?.name.en})${result.footprintKg ? ` and my footprint is ${(result.footprintKg / 1000).toFixed(1)} t CO2e/year` : ''}. What first change do you recommend?`,
              )
            }
          >
            {t.result.askAi}
          </button>
        </div>

        <h2 className="section-title left">{t.result.tipsTitle}</h2>
        <p className="muted">{t.result.tipsSubtitle}</p>
        {tips.length === 0 && <div className="card">{t.result.allGood}</div>}
        <div className="tips">
          {tips.map(({ q }, i) => (
            <div className="card tip" key={q.id}>
              <span className="tip-n">{i + 1}</span>
              <div>
                <h3>{q.category[language]}</h3>
                <p>{q.tip[language]}</p>
                <p className="impact">{q.impact[language]}</p>
              </div>
            </div>
          ))}
        </div>

        <details className="card answers">
          <summary>{t.result.answers}</summary>
          <ol>
            {forms.questions.map((q) => (
              <li key={q.id}>
                <span className="muted">{q.question[language]}</span>
                <br />
                <strong>{q.options.find((o) => o.id === result.answers[String(q.id)])?.text[language]}</strong>
              </li>
            ))}
          </ol>
        </details>

        <div className="center">
          <Link to="/questionnaire" className="btn btn-primary btn-lg">{t.result.retake}</Link>
        </div>
      </div>
    </section>
  );
}
