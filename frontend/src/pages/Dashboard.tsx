import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { QuestionnaireService } from '@/services/questionnaireService';
import type { QuestionnaireResult } from '@/services/types';

export function Dashboard() {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const [items, setItems] = useState<QuestionnaireResult[] | null>(null);

  useEffect(() => {
    if (user) QuestionnaireService.mine().then(setItems).catch(() => setItems([]));
  }, [user]);

  if (loading) return <section className="section page-center"><div className="spinner" /></section>;
  if (!user) return <Navigate to="/login" state={{ from: '/dashboard' }} replace />;

  const levelName = (key: string) => t.levels[key as keyof typeof t.levels] ?? key;

  return (
    <section className="section">
      <div className="container narrow">
        <p className="muted">{t.dashboard.hello}, {user.name.split(' ')[0]} 👋</p>
        <div className="row-between">
          <h1>{t.dashboard.title}</h1>
          <Link to="/questionnaire" className="btn btn-primary">{t.dashboard.new}</Link>
        </div>
        {!items && <div className="spinner" />}
        {items?.length === 0 && (
          <div className="card center">
            <p>{t.dashboard.empty}</p>
            <Link to="/questionnaire" className="btn btn-primary">{t.hero.cta}</Link>
          </div>
        )}
        <div className="history">
          {items?.map((q) => (
            <Link to={`/questionnaire-answer/${q.id}`} className="card history-item" key={q.id}>
              <div className="history-score">{q.score}</div>
              <div>
                <strong>{levelName(q.level)}</strong>
                <span className="muted small">
                  {new Date(q.createdAt).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US')} · {q.language.toUpperCase()}
                </span>
              </div>
              <span className="accent">{t.dashboard.view} ›</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
