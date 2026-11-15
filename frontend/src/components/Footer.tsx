import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <p>“{t.footer}”</p>
        <p className="muted small">OSDA — One Step Drives All · Um Passo Impulsiona Tudo</p>
      </div>
    </footer>
  );
}
