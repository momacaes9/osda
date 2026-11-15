import { useLanguage } from '@/i18n/LanguageContext';
import { socials } from '@/data/team';
import { CONTACT_EMAIL, YOUTUBE_CHANNEL } from '@/data/content';
import { InstagramIcon, LinkedInIcon } from './SocialIcons';
import { IconMail, IconPlay } from './Icons';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-social">
          <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram @one_step_drives_all"><InstagramIcon size={22} /></a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn OSDA"><LinkedInIcon size={22} /></a>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" aria-label="YouTube @OSDA_IA"><IconPlay size={22} /></a>
          <a href={`mailto:${CONTACT_EMAIL}`} aria-label={CONTACT_EMAIL}><IconMail size={22} /></a>
        </div>
        <p className="footer-quote">“{t.footer}”</p>
        <p className="muted small">OSDA — One Step Drives All · Um Passo Impulsiona Tudo · São Paulo, Brasil</p>
        <p className="muted small">{CONTACT_EMAIL}</p>
      </div>
    </footer>
  );
}
