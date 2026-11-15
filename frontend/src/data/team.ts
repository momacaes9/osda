import type { Language } from '@/i18n/translations';

export interface TeamMember {
  name: string;
  photo: string;
  linkedin: string;
  role: Record<Language, string>;
}

export const team: TeamMember[] = [
  {
    name: 'Júlia Genzini',
    photo: '/team/julia.jpg',
    linkedin: 'https://www.linkedin.com/in/juliagenzini/',
    role: { en: 'Systems and Ideation Manager', pt: 'Gerente de Sistemas e Ideação' },
  },
  {
    name: 'Laura Placido',
    photo: '/team/laura.jpg',
    linkedin: 'https://www.linkedin.com/in/laura-franchini-/',
    role: { en: 'Finances and Business Manager', pt: 'Gerente de Finanças e Negócios' },
  },
  {
    name: 'Monica Macaes',
    photo: '/team/monica.jpg',
    linkedin: 'https://www.linkedin.com/in/monicamacaes/',
    role: { en: 'Development and Marketing Director', pt: 'Diretora de Desenvolvimento e Marketing' },
  },
  {
    name: 'Priscila Gerhardt',
    photo: '/team/priscila.jpg',
    linkedin: 'https://www.linkedin.com/in/priscilagerhardt/',
    role: { en: 'Processes and Computer Manager', pt: 'Gerente de Processos e Computação' },
  },
];

export const socials = {
  instagram: 'https://www.instagram.com/one_step_drives_all/',
  linkedin: 'https://www.linkedin.com/company/osdaai/',
};
