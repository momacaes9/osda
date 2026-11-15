import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authenticatedService';
import type { Language } from '@/i18n/translations';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const change = (l: Language) => {
    setLanguage(l);
    if (user) authService.setLanguage(l).catch(() => undefined);
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {(['en', 'pt'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={language === l ? 'active' : ''}
          aria-pressed={language === l}
          onClick={() => change(l)}
        >
          {l === 'en' ? 'EN' : 'PT'}
        </button>
      ))}
    </div>
  );
}
