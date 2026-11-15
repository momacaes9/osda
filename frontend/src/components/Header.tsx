import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { IconMoon, IconSun } from './Icons';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close} aria-label="OSDA — home">
          <Logo size={42} />
          <span>OSDA</span>
        </Link>

        <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/questionnaire" onClick={close}>{t.nav.calculator}</NavLink>
          <a href="/#awards" onClick={close}>{t.nav.awards}</a>
          <a href="/#how" onClick={close}>{t.nav.how}</a>
          <a href="/#team" onClick={close}>{t.nav.team}</a>
          <a href="/#contact" onClick={close}>{t.nav.contact}</a>
          <NavLink to="/chat" onClick={close}>{t.nav.chat}</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={close}>{t.nav.dashboard}</NavLink>
              <button
                className="btn btn-dark"
                onClick={async () => {
                  close();
                  await logout();
                  navigate('/');
                }}
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-dark" onClick={close}>{t.nav.login}</Link>
          )}
          <div className="nav-tools">
            <LanguageToggle />
            <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label={t.nav.theme} title={t.nav.theme}>
              {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
