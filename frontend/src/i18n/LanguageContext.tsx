import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type Language, type Translation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem('osda.language');
    if (saved === 'en' || saved === 'pt') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(detectLanguage);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem('osda.language', language);
    } catch {
      /* ignore */
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
