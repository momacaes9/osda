import { Fragment, useState, type ComponentType, type SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { askChat } from '@/components/ChatBot';
import { team, socials } from '@/data/team';
import {
  awards,
  competitors,
  BLOG_FORM,
  businessPlan,
  CONTACT_EMAIL,
  FOUNDER_EMAIL,
  INSTAGRAM_POSTS,
  VOLUNTEER_FORM,
  future,
  marketFeatures,
  research,
  sdgs,
  videos,
  YOUTUBE_CHANNEL,
  type AwardIcon,
  type FutureIcon,
} from '@/data/content';
import { InstagramIcon, LinkedInIcon } from '@/components/SocialIcons';
import { Decor } from '@/components/Decor';
import { LiteYouTube } from '@/components/LiteYouTube';
import {
  IconArrow, IconBook, IconCheck, IconCopy, IconGauge, IconGlobe, IconHandshake, IconHeart, IconLeaf,
  IconMail, IconMedal, IconMic, IconPlay, IconRocket, IconSpark, IconStar, IconStore, IconTrophy, IconUsers, IconX,
} from '@/components/Icons';

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
const awardIcons: Record<AwardIcon, Icon> = {
  medal: IconMedal, trophy: IconTrophy, globe: IconGlobe, mic: IconMic, book: IconBook, star: IconStar, rocket: IconRocket,
};
const futureIcons: Record<FutureIcon, Icon> = { store: IconStore, handshake: IconHandshake, heart: IconHeart, users: IconUsers };
const benefitIcons: Icon[] = [IconGauge, IconLeaf, IconSpark, IconGlobe];

function SectionHead({ kicker, title, lead, center }: { kicker: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`}>
      <span className="kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}

export function Home() {
  const { t, language } = useLanguage();
  const s = t.sections;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  const marqueeItems = awards.map((a) => `${a.org[language]} — ${a.title[language]}`);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <Decor variant="a" />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow"><span aria-hidden="true">🇧🇷</span>{t.hero.tagline}</span>
            <h1>
              {t.hero.title1} <em>{t.hero.title2}</em> {t.hero.title3}
            </h1>
            <p className="hero-sub">
              <strong>OSDA</strong> — {t.hero.acronym} — {t.hero.subtitle}
            </p>
            <div className="hero-ctas">
              <Link to="/questionnaire" className="btn btn-primary btn-lg">
                {t.hero.cta} <IconArrow size={18} />
              </Link>
              <button className="btn btn-outline btn-lg" onClick={() => askChat(t.chat.suggestions[0])}>
                {t.hero.chatCta}
              </button>
            </div>
            <div className="hero-stats">
              <div><strong>{INSTAGRAM_POSTS}</strong><span>{t.instaPosts}</span></div>
              <div><strong>{research.reach}</strong><span>{s.reach}</span></div>
              <div><strong>{research.respondents}</strong><span>{s.researchLead}</span></div>
              <div><strong>Top 10</strong><span>Global Innovation Challenge</span></div>
            </div>
          </div>
          <div className="hero-medal">
            <img src="/logo.jpg" alt="OSDA — One Step Drives All" width={320} height={320} fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* ---------------- Recognition marquee ---------------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="marquee-item" key={i}><IconStar size={16} /> {item}</span>
          ))}
        </div>
      </div>

      {/* ---------------- Awards ---------------- */}
      <section id="awards" className="section">
        <div className="container">
          <SectionHead kicker={s.recognition} title={s.recognitionTitle} />
          <div className="awards-grid">
            {awards.map((a) => {
              const I = awardIcons[a.icon];
              return (
                <article className={`award ${a.highlight ? 'highlight' : ''}`} key={a.org.en + a.year}>
                  <div className="award-top">
                    <span className="award-icon"><I size={24} /></span>
                    <span className="award-year">{a.year}</span>
                  </div>
                  <h3>{a.title[language]}</h3>
                  <p className="org">{a.org[language]}</p>
                  <p className="detail">{a.detail[language]}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="section">
        <div className="container">
          <SectionHead kicker={s.how} title={t.how.title} />
          <div className="grid grid-3">
            {t.how.steps.map((step, i) => (
              <div className="card" key={step.title}>
                <span className="step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Calculator teaser ---------------- */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="teaser">
            <Decor variant="b" />
            <div style={{ position: 'relative' }}>
              <span className="kicker" style={{ color: 'inherit' }}>CO2</span>
              <h2>{s.calcTeaser}</h2>
              <p>{s.calcTeaserText}</p>
              <Link to="/questionnaire" className="btn btn-lg">{t.hero.cta} <IconArrow size={18} /></Link>
            </div>
            <div className="teaser-meter" style={{ position: 'relative' }}>
              <strong>?</strong>
              <span>t CO2e / {language === 'pt' ? 'ano' : 'year'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Benefits ---------------- */}
      <section id="benefits" className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead kicker={s.discover} title={t.benefits.title} />
          <div className="grid grid-4">
            {t.benefits.items.map((b, i) => {
              const I = benefitIcons[i % benefitIcons.length];
              return (
                <div className="card" key={b.title}>
                  <span className="feature-icon"><I size={22} /></span>
                  <h3>{b.title}</h3>
                  <p className="muted" style={{ margin: 0 }}>{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Videos ---------------- */}
      <section id="videos" className="section">
        <div className="container">
          <div className="row-between" style={{ alignItems: 'flex-end', marginBottom: 32 }}>
            <SectionHead kicker={s.videos} title={s.videosTitle} />
            <a className="arrow-link" href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" style={{ marginBottom: 40 }}>
              <IconPlay size={18} /> {s.channel} <IconArrow size={16} />
            </a>
          </div>
          <div className="videos">
            {videos.map((v) => (
              <div className="video" key={v.id}>
                <LiteYouTube id={v.id} title={v.title[language]} playLabel={s.play} />
                <div>
                  <h3>{v.title[language]}</h3>
                  <span className="tag">{v.tag[language]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Research ---------------- */}
      <section id="research" className="section">
        <div className="container">
          <div className="research">
            <div>
              <span className="kicker">{s.research}</span>
              <h2 className="section-title">{s.researchTitle}</h2>
              <div className="research-big" style={{ marginTop: 28 }}>{research.respondents}</div>
              <p className="muted">{s.researchLead}</p>
            </div>
            <div className="stat-bars">
              {research.stats.map((st) => (
                <div key={st.label.en}>
                  <div className="stat-bar-label">
                    <span>{st.label[language]}</span>
                    <strong>{st.value.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US')}%</strong>
                  </div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{ width: `${st.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Market ---------------- */}
      <section id="market" className="section">
        <div className="container">
          <SectionHead kicker={s.market} title={s.marketTitle} />
          <div className="table-wrap">
            <table className="market">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {competitors.map((c) => (
                    <th scope="col" key={c.name} className={c.name === 'OSDA' ? 'osda' : ''}>{c.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marketFeatures.map((f, row) => (
                  <tr key={f.en}>
                    <th scope="row">{f[language]}</th>
                    {competitors.map((c) => (
                      <td key={c.name} className={c.name === 'OSDA' ? 'osda' : ''}>
                        {c.has[row] ? (
                          <span className="mark-yes" aria-label={s.yes}><IconCheck size={20} /></span>
                        ) : (
                          <span className="mark-no" aria-label={s.no}><IconX size={18} /></span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- Business plan ---------------- */}
      <section id="business-plan" className="section">
        <div className="container">
          <SectionHead kicker={t.plan.kicker} title={t.plan.title} lead={t.plan.lead} />
          <div className="plan-grid">
            {businessPlan.map((p, i) => (
              <div className="plan-item" key={p.title.en}>
                <span className="plan-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title[language]}</h3>
                <p className="muted">{p.text[language]}</p>
              </div>
            ))}
          </div>
          <div className="plan-cta">
            <a
              className="btn btn-primary btn-lg"
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.plan.subject)}&body=${t.plan.body}`}
            >
              <IconBook size={20} /> {t.plan.cta}
            </a>
            <span className="muted small">{t.plan.note}</span>
          </div>
        </div>
      </section>

      {/* ---------------- SDGs ---------------- */}
      <section id="sdg" className="section">
        <div className="container">
          <SectionHead kicker={s.sdg} title={s.sdgTitle} />
          <div className="sdg-row">
            {sdgs.map((g, i) => (
              <Fragment key={g.n}>
                {i > 0 ? <span className="sdg-plus" aria-hidden="true">+</span> : null}
                <a className="sdg-tile" href={`https://sdgs.un.org/goals/goal${g.n}`} target="_blank" rel="noopener noreferrer">
                  <img src={g.img} alt={`SDG ${g.n} — ${g.title[language]}`} width={302} height={302} loading="lazy" />
                </a>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Team ---------------- */}
      <section id="team" className="section">
        <div className="container">
          <SectionHead kicker={`${s.team} · ${t.classOf}`} title={t.team.title} lead={`${t.hero.tagline} 🇧🇷 ${t.classText}`} />
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
                <img src={m.photo} alt={m.name} width={132} height={132} loading="lazy" className="member-photo" />
                <h3>{m.name}</h3>
                <p className="muted">{m.role[language]}</p>
                <p className="member-school">
                  <strong>{m.school}</strong>
                  <span>{m.major[language]} · {t.classOf}</span>
                </p>
                <span className="member-link"><LinkedInIcon size={16} /> LinkedIn</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Coming next ---------------- */}
      <section id="next" className="section">
        <div className="container">
          <SectionHead kicker={s.next} title={s.nextTitle} />
          <div className="future-grid">
            {future.map((f) => {
              const I = futureIcons[f.icon];
              return (
                <div className="card future-card" key={f.title.en}>
                  <div className="future-top">
                    <span className="feature-icon"><I size={22} /></span>
                    <span className="soon">{s.soon}</span>
                  </div>
                  <h3>{f.title[language]}</h3>
                  <p className="muted" style={{ margin: 0 }}>{f.text[language]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Get involved ---------------- */}
      <section id="involved" className="section">
        <div className="container">
          <SectionHead kicker={t.involved.kicker} title={t.involved.title} />
          <div className="involved-grid">
            <div className="card involved-card highlight-card">
              <div className="future-top">
                <span className="feature-icon"><IconUsers size={22} /></span>
                <span className="pill">{t.involved.volBadge}</span>
              </div>
              <h3>{t.involved.volTitle}</h3>
              <p className="muted">{t.involved.volText}</p>
              <ul className="ticks">
                {t.involved.volPoints.map((p) => (
                  <li key={p}><IconCheck size={16} /> {p}</li>
                ))}
              </ul>
              <a className="btn btn-primary" href={VOLUNTEER_FORM} target="_blank" rel="noopener noreferrer">
                {t.involved.volCta} <IconArrow size={16} />
              </a>
            </div>
            <div className="card involved-card">
              <div className="future-top">
                <span className="feature-icon"><IconBook size={22} /></span>
                <span className="pill muted-pill">{t.involved.blogBadge}</span>
              </div>
              <h3>{t.involved.blogTitle}</h3>
              <p className="muted">{t.involved.blogText}</p>
              <a className="btn btn-outline" href={BLOG_FORM} target="_blank" rel="noopener noreferrer">
                {t.involved.blogCta} <IconArrow size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="section">
        <div className="container">
          <div className="contact">
            <Decor variant="b" />
            <div>
              <span className="kicker">{s.contact}</span>
              <h2>{s.contactTitle}</h2>
              <p className="lead">{s.contactText}</p>
            </div>
            <div className="contact-actions">
              <span className="email-label">{t.teamContact}</span>
              <div className="email-box">
                <IconMail size={18} />
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <button className="btn btn-outline" onClick={copyEmail} aria-live="polite">
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />} {copied ? s.copied : s.copy}
                </button>
              </div>
              <span className="email-label">{t.founderContact}</span>
              <div className="email-box">
                <IconMail size={18} />
                <a href={`mailto:${FOUNDER_EMAIL}`}>{FOUNDER_EMAIL}</a>
              </div>
              <a className="btn btn-primary btn-lg" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(language === 'pt' ? 'Parceria com a OSDA' : 'Partnership with OSDA')}`}>
                <IconHandshake size={20} /> {s.partner}
              </a>
              <div className="socials">
                <a className="social" href={socials.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon size={18} /> Instagram</a>
                <a className="social" href={socials.linkedin} target="_blank" rel="noopener noreferrer"><LinkedInIcon size={18} /> LinkedIn</a>
                <a className="social" href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer"><IconPlay size={18} /> YouTube</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
