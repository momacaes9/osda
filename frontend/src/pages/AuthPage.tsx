import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { t, language } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = (location.state as { from?: string } | null)?.from || '/dashboard';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLogin = mode === 'login';

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password, language);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError((err as Error).message || t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section page-center">
      <form className="card auth-card" onSubmit={onSubmit}>
        <div className="center"><Logo size={52} /></div>
        <h1>{isLogin ? t.auth.loginTitle : t.auth.registerTitle}</h1>
        <p className="muted center">{isLogin ? t.auth.loginSubtitle : t.auth.registerSubtitle}</p>

        {!isLogin && (
          <label className="field">
            <span>{t.auth.name}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} autoComplete="name" />
          </label>
        )}
        <label className="field">
          <span>{t.auth.email}</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="field">
          <span>{t.auth.password}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {!isLogin && <small className="muted">{t.auth.passwordHint}</small>}
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? t.auth.loading : isLogin ? t.auth.loginBtn : t.auth.registerBtn}
        </button>

        <p className="center muted small">
          {isLogin ? t.auth.noAccount : t.auth.haveAccount}{' '}
          <Link to={isLogin ? '/register' : '/login'} state={location.state} className="accent">
            {isLogin ? t.nav.register : t.nav.login}
          </Link>
        </p>
      </form>
    </section>
  );
}
