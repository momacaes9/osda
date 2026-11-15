import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close}>
          <Logo size={40} />
          <span>OSDA</span>
        </Link>

        <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'open' : ''}`}>
          <a href="/#how" onClick={close}>{t.nav.how}</a>
          <a href="/#benefits" onClick={close}>{t.nav.benefits}</a>
          <a href="/#team" onClick={close}>{t.nav.team}</a>
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
            <>
              <Link to="/login" className="btn btn-dark" onClick={close}>{t.nav.login}</Link>
              <Link to="/register" className="btn btn-dark" onClick={close}>{t.nav.register}</Link>
            </>
          )}
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
