import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

const TITLES: Record<string, { en: string; pt: string }> = {
  '/': { en: 'OSDA — One Step Drives All · Sustainability with AI', pt: 'OSDA — Um Passo Impulsiona Tudo · Sustentabilidade com IA' },
  '/questionnaire': { en: 'CO2 footprint calculator & sustainability quiz · OSDA', pt: 'Calculadora de pegada de carbono e quiz · OSDA' },
  '/chat': { en: 'AI sustainability assistant · OSDA', pt: 'Assistente de sustentabilidade com IA · OSDA' },
  '/login': { en: 'Log in · OSDA', pt: 'Entrar · OSDA' },
  '/register': { en: 'Create account · OSDA', pt: 'Criar conta · OSDA' },
  '/dashboard': { en: 'My results · OSDA', pt: 'Meus resultados · OSDA' },
};

/** Scroll to top (or to the #hash) on navigation and keep the document title in sync. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    const title = TITLES[pathname] ?? (pathname.startsWith('/questionnaire-answer') ? { en: 'My result · OSDA', pt: 'Meu resultado · OSDA' } : TITLES['/']);
    document.title = title[language];
  }, [pathname, language]);

  return null;
}
