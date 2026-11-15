import { useLanguage } from '@/i18n/LanguageContext';
import { socials } from '@/data/team';
import { InstagramIcon, LinkedInIcon } from './SocialIcons';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-social">
          <a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram @one_step_drives_all">
            <InstagramIcon size={22} />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn OSDA">
            <LinkedInIcon size={22} />
          </a>
        </div>
        <p>“{t.footer}”</p>
        <p className="muted small">OSDA — One Step Drives All · Um Passo Impulsiona Tudo</p>
      </div>
    </footer>
  );
}
