import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { askChat } from '@/components/ChatBot';
import { team, socials } from '@/data/team';
import { InstagramIcon, LinkedInIcon } from '@/components/SocialIcons';

export function Home() {
  const { t, language } = useLanguage();
  return (
    <>
      <section className="hero">
        <div className="blob" aria-hidden="true" />
        <div className="container hero-inner">
          <p className="eyebrow">🌱 {t.hero.motto}</p>
          <h1>
            {t.hero.title1}
            <br />
            <span className="accent">{t.hero.title2}</span> {t.hero.title3}
          </h1>
          <p className="hero-sub">
            <strong>OSDA</strong> — <span className="accent">{t.hero.acronym}</span> — {t.hero.subtitle}
          </p>
          <div className="hero-ctas">
            <Link to="/questionnaire" className="btn btn-primary btn-lg">{t.hero.cta}</Link>
            <button className="btn btn-outline btn-lg" onClick={() => askChat(t.chat.suggestions[0])}>
              {t.hero.chatCta}
            </button>
          </div>
          <div className="community">
            <div className="dots" aria-hidden="true"><span /><span /><span /><span /></div>
            <span className="muted">{t.hero.community}</span>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <h2 className="section-title">{t.how.title}</h2>
          <div className="grid grid-3">
            {t.how.steps.map((s, i) => (
              <div className="card step" key={s.title}>
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p className="muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="section">
        <div className="container">
          <h2 className="section-title">{t.benefits.title}</h2>
          <div className="grid grid-4">
            {t.benefits.items.map((b) => (
              <div className="card benefit" key={b.title}>
                <span className="benefit-icon" aria-hidden="true">{b.icon}</span>
                <h3>{b.title}</h3>
                <p className="muted">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="center">
            <Link to="/questionnaire" className="btn btn-primary btn-lg">{t.hero.cta}</Link>
            <p className="muted small">{t.benefits.meta}</p>
          </div>
        </div>
      </section>
      <section id="awards" className="section section-tight">
        <div className="container">
          <h2 className="section-title">{t.awards.title}</h2>
          <div className="awards">
            {t.awards.items.map((a) => (
              <div className="card award" key={a.title}>
                <span className="award-icon" aria-hidden="true">{a.icon}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p className="accent">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section">
        <div className="container">
          <h2 className="section-title">{t.team.title}</h2>
          <p className="muted center team-sub">{t.team.subtitle}</p>
          <div className="team-grid">
            {team.map((m) => (
              <a
                key={m.name}
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="card member"
                aria-label={`${t.team.linkedin} ${m.name}`}
              >
                <img src={m.photo} alt={m.name} width={128} height={128} loading="lazy" className="member-photo" />
                <h3>{m.name}</h3>
                <p className="muted">{m.role[language]}</p>
                <span className="member-link"><LinkedInIcon size={16} /> LinkedIn</span>
              </a>
            ))}
          </div>
          <div className="follow">
            <span className="muted">{t.follow.title}</span>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <InstagramIcon size={18} /> {t.follow.instagram}
            </a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <LinkedInIcon size={18} /> {t.follow.linkedin}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
