import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QuestionnaireManager } from '@/components/questionnaire/QuestionnaireManager';
import { QuestionRenderer } from '@/components/questionnaire/QuestionRenderer';
import { QuestionnaireService } from '@/services/questionnaireService';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import type { Forms } from '@/services/types';

export function QuestionnairePage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [forms, setForms] = useState<Forms | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    QuestionnaireService.getForms().then(setForms).catch(() => setError(true));
  }, []);

  return (
    <section className="section page-center">
      <div className="question-wrap">
        {!loading && !user && (
          <div className="notice">
            <span>{t.q.guestNote}</span>
            <Link to="/login" state={{ from: '/questionnaire' }} className="accent">{t.q.loginToSave}</Link>
          </div>
        )}
        {error && <p className="form-error">{t.q.loadError}</p>}
        {!forms && !error && <div className="spinner" aria-label="Loading" />}
        {forms && (
          <QuestionnaireManager questions={forms.questions}>
            <QuestionRenderer />
          </QuestionnaireManager>
        )}
      </div>
    </section>
  );
}
