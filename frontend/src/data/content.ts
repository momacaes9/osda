import type { Language } from '@/i18n/translations';

type L = Record<Language, string>;

export const CONTACT_EMAIL = 'osda.ambientalglobal@gmail.com';
export const YOUTUBE_CHANNEL = 'https://www.youtube.com/@OSDA_IA';

/* ---------------- Recognition ---------------- */
export type AwardIcon = 'medal' | 'trophy' | 'globe' | 'mic' | 'book' | 'star';
export interface Award {
  icon: AwardIcon;
  year: string;
  title: L;
  org: L;
  detail: L;
  highlight?: boolean;
}

export const awards: Award[] = [
  {
    icon: 'medal',
    year: '2026',
    highlight: true,
    title: { en: 'Bronze Award', pt: 'Prêmio Bronze' },
    org: { en: 'GYC — The Global Youth Challenge', pt: 'GYC — The Global Youth Challenge' },
    detail: {
      en: 'Judged by University of Toronto (OISE · Encore Lab), Brock University, University of Waterloo and Erindale Academy.',
      pt: 'Avaliado por University of Toronto (OISE · Encore Lab), Brock University, University of Waterloo e Erindale Academy.',
    },
  },
  {
    icon: 'globe',
    year: '2025',
    highlight: true,
    title: { en: 'Top 10 in the world · #2 in LATAM', pt: 'Top 10 mundial · 2º na América Latina' },
    org: { en: 'Global Innovation Challenge', pt: 'Global Innovation Challenge' },
    detail: { en: 'Among the ten best projects worldwide.', pt: 'Entre os dez melhores projetos do mundo.' },
  },
  {
    icon: 'mic',
    year: '2025',
    highlight: true,
    title: { en: 'LATAM Finalist', pt: 'Finalista LATAM' },
    org: { en: 'PFF25 — Pitch for the Future', pt: 'PFF25 — Pitch for the Future' },
    detail: { en: 'Pitch selected for the Latin American final.', pt: 'Pitch selecionado para a final latino-americana.' },
  },
  {
    icon: 'trophy',
    year: '2025',
    title: { en: 'Regional stage', pt: 'Etapa regional' },
    org: { en: 'Technovation Girls', pt: 'Technovation Girls' },
    detail: { en: 'Pitch and technical videos of the OSDA app.', pt: 'Vídeos de pitch e técnico do app OSDA.' },
  },
  {
    icon: 'book',
    year: '2025',
    title: { en: 'Research poster showcase', pt: 'Apresentação de pôster científico' },
    org: { en: 'Mizzou Academy · University of Missouri', pt: 'Mizzou Academy · University of Missouri' },
    detail: { en: 'Action research with 152 respondents.', pt: 'Pesquisa-ação com 152 respondentes.' },
  },
  {
    icon: 'star',
    year: '2024',
    title: { en: 'Outstanding award', pt: 'Prêmio de destaque' },
    org: { en: 'ESPM — high school research showcase', pt: 'ESPM — mostra de pesquisa do ensino médio' },
    detail: { en: 'Where it all started, as the project "ONG".', pt: 'Onde tudo começou, ainda como o projeto "ONG".' },
  },
];

/* ---------------- Videos ---------------- */
export interface Video {
  id: string;
  title: L;
  tag: L;
}
export const videos: Video[] = [
  { id: 'IzrVQ9rC0D8', title: { en: 'Pitch Video 2025', pt: 'Vídeo de Pitch 2025' }, tag: { en: 'Technovation Girls', pt: 'Technovation Girls' } },
  { id: 'zrXBs6hARxI', title: { en: 'Technical Video 2025', pt: 'Vídeo Técnico 2025' }, tag: { en: 'Technovation Girls', pt: 'Technovation Girls' } },
  { id: 'cUc3uAW2bVU', title: { en: 'PFF25 LATAM — Finalist', pt: 'PFF25 LATAM — Finalista' }, tag: { en: 'Pitch for the Future', pt: 'Pitch for the Future' } },
  { id: '33FbGtiJNEM', title: { en: 'GYC 2026 — Bronze Award', pt: 'GYC 2026 — Prêmio Bronze' }, tag: { en: 'Global Youth Challenge', pt: 'Global Youth Challenge' } },
];

/* ---------------- Research (business plan + Mizzou poster) ---------------- */
export const research = {
  respondents: 152,
  reach: '7,000+',
  stats: [
    { value: 58.6, label: { en: 'felt highly motivated to change habits after the AI tips', pt: 'se sentiram muito motivados a mudar hábitos após as dicas da IA' } },
    { value: 76.3, label: { en: 'want to learn how their attitudes affect the climate', pt: 'querem saber como suas atitudes afetam o clima' } },
    { value: 49.3, label: { en: 'only buy what they really need', pt: 'só compram o que realmente precisam' } },
    { value: 16.4, label: { en: 'separate their waste for recycling', pt: 'separam o lixo para reciclagem' } },
    { value: 17.1, label: { en: 'unplug electronics when not in use', pt: 'tiram os eletrônicos da tomada' } },
  ],
};

/* ---------------- Market comparison ---------------- */
export const marketFeatures: L[] = [
  { en: 'Focus on all impacts', pt: 'Foco em todos os impactos' },
  { en: 'CO2 estimate', pt: 'Estimativa de CO2' },
  { en: 'AI profile recommendations', pt: 'Recomendações por perfil com IA' },
  { en: 'Local hands-on events', pt: 'Eventos presenciais locais' },
  { en: 'SDG community', pt: 'Comunidade ODS' },
  { en: 'Donations', pt: 'Doações' },
  { en: 'Eco-affiliate market', pt: 'Mercado eco-afiliado' },
];
export const competitors: { name: string; has: boolean[] }[] = [
  { name: 'OSDA', has: [true, true, true, true, true, true, true] },
  { name: 'Tree Aid', has: [false, false, false, false, true, true, false] },
  { name: 'SOS Floresta Amazônica', has: [false, true, false, false, true, true, false] },
  { name: 'Earth Hero', has: [true, true, false, true, true, true, false] },
  { name: 'Stand For Trees', has: [false, true, false, false, true, true, true] },
];

/* ---------------- UN SDGs ---------------- */
export const sdgs: { n: number; color: string; title: L }[] = [
  { n: 11, color: '#FD9D24', title: { en: 'Sustainable cities and communities', pt: 'Cidades e comunidades sustentáveis' } },
  { n: 12, color: '#BF8B2E', title: { en: 'Responsible consumption and production', pt: 'Consumo e produção responsáveis' } },
  { n: 13, color: '#3F7E44', title: { en: 'Climate action', pt: 'Ação contra a mudança global do clima' } },
  { n: 14, color: '#0A97D9', title: { en: 'Life below water', pt: 'Vida na água' } },
];

/* ---------------- Coming next ---------------- */
export type FutureIcon = 'store' | 'handshake' | 'heart' | 'users';
export const future: { icon: FutureIcon; title: L; text: L }[] = [
  {
    icon: 'store',
    title: { en: 'Eco-friendly marketplace', pt: 'Marketplace eco-friendly' },
    text: {
      en: 'Affiliate store of sustainable products, with discounts that grow with the CO2 you avoid.',
      pt: 'Loja afiliada de produtos sustentáveis, com descontos que crescem com o CO2 que você evita.',
    },
  },
  {
    icon: 'handshake',
    title: { en: 'Partners & sponsors', pt: 'Parceiros e patrocinadores' },
    text: {
      en: 'Brands and organizations that share our mission. Interested? Write to us.',
      pt: 'Marcas e organizações que compartilham nossa missão. Tem interesse? Escreva para nós.',
    },
  },
  {
    icon: 'heart',
    title: { en: 'Donate what you save', pt: 'Doe o que você economiza' },
    text: {
      en: 'Turn part of the money saved with greener habits into support for environmental projects.',
      pt: 'Transforme parte do dinheiro economizado com hábitos verdes em apoio a projetos ambientais.',
    },
  },
  {
    icon: 'users',
    title: { en: 'Hands-on events', pt: 'Eventos presenciais' },
    text: {
      en: 'Clean-ups and recycling workshops at fairs like Eco Expo and IFAT Brasil in São Paulo.',
      pt: 'Mutirões de limpeza e oficinas de reciclagem em feiras como Eco Expo e IFAT Brasil, em São Paulo.',
    },
  },
];

/* ---------------- Consumer profiles ---------------- */
export const profiles: Record<string, { name: L; text: L }> = {
  guardian: {
    name: { en: 'The Guardian', pt: 'O Guardião' },
    text: {
      en: 'Your footprint is already below the 2030 climate target. Your next step is to inspire others.',
      pt: 'Sua pegada já está abaixo da meta climática de 2030. Seu próximo passo é inspirar outras pessoas.',
    },
  },
  balanced: {
    name: { en: 'The Balanced', pt: 'O Equilibrado' },
    text: {
      en: 'Your emissions are spread across many areas — small tweaks everywhere add up.',
      pt: 'Suas emissões estão espalhadas em várias áreas — pequenos ajustes em tudo somam muito.',
    },
  },
  commuter: {
    name: { en: 'The Commuter', pt: 'O Viajante Urbano' },
    text: {
      en: 'Getting around is your biggest impact. Public transport, carpooling and cycling are your power moves.',
      pt: 'Seu maior impacto é o deslocamento. Transporte público, carona e bicicleta são suas melhores jogadas.',
    },
  },
  globetrotter: {
    name: { en: 'The Globetrotter', pt: 'O Globetrotter' },
    text: {
      en: 'Flights dominate your footprint. Fewer, longer trips and trains for short distances help a lot.',
      pt: 'Voos dominam sua pegada. Menos viagens, mais longas, e trem em distâncias curtas ajudam muito.',
    },
  },
  homebody: {
    name: { en: 'The Homebody', pt: 'O Caseiro' },
    text: {
      en: 'Home energy is your biggest source. Efficient appliances and unplugging idle devices pay off.',
      pt: 'A energia de casa é sua maior fonte. Aparelhos eficientes e tirar da tomada o que não usa compensam.',
    },
  },
  foodie: {
    name: { en: 'The Foodie', pt: 'O Gourmet' },
    text: {
      en: 'Your plate is where your impact lives. Swapping some red meat for plants is your biggest lever.',
      pt: 'Seu impacto está no prato. Trocar parte da carne vermelha por vegetais é sua maior alavanca.',
    },
  },
  shopper: {
    name: { en: 'The Shopper', pt: 'O Consumidor' },
    text: {
      en: 'New things carry hidden carbon. Thrift, repair and buy less, but better.',
      pt: 'Coisas novas carregam carbono escondido. Brechó, conserto e comprar menos, mas melhor.',
    },
  },
};

export const carbonCategories: Record<string, L> = {
  transport: { en: 'Transport', pt: 'Transporte' },
  flights: { en: 'Flights', pt: 'Voos' },
  home: { en: 'Home energy', pt: 'Energia em casa' },
  food: { en: 'Food', pt: 'Alimentação' },
  shopping: { en: 'Shopping', pt: 'Compras' },
  waste: { en: 'Waste', pt: 'Resíduos' },
};
