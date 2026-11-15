/**
 * OSDA sustainability questionnaire — single source of truth.
 * The frontend loads it from GET /api/questionnaire/forms.
 * Every text is available in English (en) and Portuguese (pt).
 */
export type Language = 'en' | 'pt';
export type Localized = Record<Language, string>;

export interface FormOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: Localized;
  points: number; // 0 (least sustainable) .. 3 (most sustainable)
}

export interface FormQuestion {
  id: number;
  category: Localized;
  question: Localized;
  options: FormOption[];
  tip: Localized;
  impact: Localized;
}

const opt = (id: FormOption['id'], points: number, en: string, pt: string): FormOption => ({
  id,
  points,
  text: { en, pt },
});

export const forms: FormQuestion[] = [
  {
    id: 1,
    category: { en: 'Transport', pt: 'Transporte' },
    question: {
      en: 'How do you usually get around day to day?',
      pt: 'Como você costuma se deslocar no dia a dia?',
    },
    options: [
      opt('A', 0, 'Private car', 'Carro particular'),
      opt('B', 1, 'Shared car (carpool)', 'Carro compartilhado (carona)'),
      opt('C', 2, 'Public transport', 'Transporte público'),
      opt('D', 3, 'Bike or on foot', 'Bicicleta ou a pé'),
    ],
    tip: {
      en: 'Try to use public transport, a bike or walk at least twice a week. It significantly reduces your carbon footprint.',
      pt: 'Tente usar transporte público, bicicleta ou caminhada pelo menos 2 vezes por semana. Isso reduz significativamente sua pegada de carbono.',
    },
    impact: { en: 'Cuts up to 2 tonnes of CO2 per year', pt: 'Reduz até 2 toneladas de CO2 por ano' },
  },
  {
    id: 2,
    category: { en: 'Energy', pt: 'Energia' },
    question: {
      en: 'How often do you unplug electronic devices when they are not in use?',
      pt: 'Com que frequência você desliga aparelhos eletrônicos da tomada quando não estão em uso?',
    },
    options: [
      opt('A', 0, 'Never', 'Nunca'),
      opt('B', 1, 'Rarely', 'Raramente'),
      opt('C', 2, 'Often', 'Frequentemente'),
      opt('D', 3, 'Always', 'Sempre'),
    ],
    tip: {
      en: 'Unplug devices you are not using. Power strips with a switch make it easy.',
      pt: 'Desligue aparelhos da tomada quando não estiver usando. Use filtros de linha com interruptor para facilitar.',
    },
    impact: { en: 'Saves up to 10% on your energy bill', pt: 'Economiza até 10% na conta de energia' },
  },
  {
    id: 3,
    category: { en: 'E-waste', pt: 'Lixo eletrônico' },
    question: {
      en: 'What do you do with batteries at the end of their life?',
      pt: 'O que você faz com pilhas e baterias ao final da vida útil?',
    },
    options: [
      opt('A', 0, 'I always throw them in the regular trash', 'Sempre jogo no lixo comum'),
      opt('B', 1, "Regular trash, because I don't know what else to do", 'Jogo no lixo comum, porque não sei o que fazer com elas'),
      opt('C', 2, 'Sometimes I take them to recycling points', 'Às vezes, entrego em locais de coleta seletiva'),
      opt('D', 3, 'I always take them to a dedicated collection point', 'Levo sempre a um ponto de coleta específico para descarte'),
    ],
    tip: {
      en: 'Keep a small box at home for used batteries and drop them at a collection point (supermarkets and electronics stores usually have one).',
      pt: 'Tenha uma caixinha em casa para pilhas usadas e leve a um ponto de coleta (supermercados e lojas de eletrônicos costumam ter).',
    },
    impact: { en: 'Keeps heavy metals out of soil and water', pt: 'Evita metais pesados no solo e na água' },
  },
  {
    id: 4,
    category: { en: 'Waste', pt: 'Resíduos' },
    question: { en: 'How do you dispose of your trash?', pt: 'Como você descarta seu lixo?' },
    options: [
      opt('A', 0, "I don't separate my trash", 'Não separo o lixo'),
      opt('B', 1, 'I separate only some materials', 'Separo apenas alguns materiais'),
      opt('C', 2, 'I recycle regularly', 'Faço coleta seletiva regularmente'),
      opt('D', 3, 'I recycle and compost', 'Faço coleta seletiva e compostagem'),
    ],
    tip: {
      en: 'Start with two bins: recyclables and organic. Composting food scraps can cut your household waste by up to 50%.',
      pt: 'Comece com duas lixeiras: recicláveis e orgânicos. A compostagem pode reduzir o lixo de casa em até 50%.',
    },
    impact: { en: 'Reduces landfill waste by up to 50%', pt: 'Reduz até 50% do lixo enviado a aterros' },
  },
  {
    id: 5,
    category: { en: 'Food', pt: 'Alimentação' },
    question: { en: 'What is your predominant diet?', pt: 'Qual é o seu padrão alimentar predominante?' },
    options: [
      opt('A', 0, 'I eat red meat regularly', 'Consumo carne vermelha regularmente'),
      opt('B', 1, 'I eat only white meat (chicken and/or fish)', 'Consumo apenas carnes brancas (frango e/ou peixe)'),
      opt('C', 2, "I'm vegetarian", 'Sou vegetariano'),
      opt('D', 3, "I'm vegan", 'Sou vegano'),
    ],
    tip: {
      en: 'Try one or two meat-free days per week. Swapping red meat for plant proteins is one of the highest-impact changes you can make.',
      pt: 'Experimente um ou dois dias sem carne por semana. Trocar carne vermelha por proteínas vegetais é uma das mudanças de maior impacto.',
    },
    impact: { en: 'Cuts up to 0.8 tonnes of CO2 per year', pt: 'Reduz até 0,8 tonelada de CO2 por ano' },
  },
  {
    id: 6,
    category: { en: 'Reuse', pt: 'Reutilização' },
    question: {
      en: 'Do you usually sell, donate or swap used clothes and items?',
      pt: 'Você costuma negociar, doar ou trocar roupas e objetos usados?',
    },
    options: [
      opt('A', 0, 'No, I always prefer to buy new', 'Não, prefiro sempre comprar novos'),
      opt('B', 1, 'Rarely, only when I find something interesting', 'Raramente, só quando acho algo interessante'),
      opt('C', 2, 'Sometimes I join swaps or sell used items on apps', 'Às vezes, participo de trocas ou vendo itens usados em apps'),
      opt('D', 3, 'Yes, I always trade on apps, bazaars and thrift stores', 'Sim, sempre negocio em apps, bazares e brechós'),
    ],
    tip: {
      en: 'Give a second life to things you no longer use: donate, swap or sell them in thrift stores and second-hand apps.',
      pt: 'Dê uma segunda vida ao que você não usa mais: doe, troque ou venda em brechós e apps de usados.',
    },
    impact: { en: 'Extends product life and avoids new production', pt: 'Prolonga a vida útil e evita nova produção' },
  },
  {
    id: 7,
    category: { en: 'Consumption', pt: 'Consumo' },
    question: {
      en: 'How often do you buy new clothes and products?',
      pt: 'Com que frequência você compra roupas e produtos novos?',
    },
    options: [
      opt('A', 0, 'Monthly or more', 'Mensalmente ou mais'),
      opt('B', 1, 'Every 2-3 months', 'A cada 2-3 meses'),
      opt('C', 2, 'A few times a year', 'Poucas vezes por ano'),
      opt('D', 3, 'Rarely, I prefer to reuse/repair', 'Raramente, prefiro reutilizar/consertar'),
    ],
    tip: {
      en: 'Before buying something new, ask yourself: do I really need it? Can I repair, borrow or buy it second-hand?',
      pt: 'Antes de comprar algo novo, pergunte-se: realmente preciso? Posso consertar, emprestar ou comprar usado?',
    },
    impact: { en: 'Reduces waste and saves resources', pt: 'Reduz desperdício e economiza recursos' },
  },
  {
    id: 8,
    category: { en: 'Local products', pt: 'Produtos locais' },
    question: {
      en: 'Do you choose sustainable products and food (e.g. eco-labelled or organic)?',
      pt: 'Você costuma escolher produtos e alimentos sustentáveis (ex. produtos com selo ambiental ou orgânicos)?',
    },
    options: [
      opt('A', 0, "No, I buy whatever is most practical or affordable", 'Não, compro o que for mais prático ou acessível'),
      opt('B', 1, 'Sometimes, if the price is similar to regular products', 'Às vezes, se o preço for parecido com o de produtos comuns'),
      opt('C', 2, "Often, but I don't always check labels or origin", 'Frequentemente, mas nem sempre verifico selo ou origem'),
      opt('D', 3, 'I always prioritise sustainable products, regardless of price', 'Sempre priorizo produtos sustentáveis, independentemente do preço'),
    ],
    tip: {
      en: 'Visit local farmers markets and buy seasonal food. It reduces transport emissions.',
      pt: 'Visite feiras de produtores locais e compre alimentos da época. Isso reduz emissões de transporte.',
    },
    impact: { en: 'Reduces transport carbon footprint', pt: 'Reduz pegada de carbono do transporte' },
  },
  {
    id: 9,
    category: { en: 'Plastic', pt: 'Plástico' },
    question: {
      en: 'How do you deal with single-use plastics (e.g. bottles, bags, cups)?',
      pt: 'Como você lida com produtos de plástico descartável (ex. garrafas, sacolas, copos, etc)?',
    },
    options: [
      opt('A', 0, 'I use them without worrying and throw them in the regular trash', 'Uso sem me preocupar e jogo no lixo comum'),
      opt('B', 1, 'I use them, but try to put them in the recycling', 'Utilizo, mas procuro descartar no lixo reciclável'),
      opt('C', 2, 'I reuse them or keep them to use again when possible', 'Reutilizo ou guardo para usar novamente quando possível'),
      opt('D', 3, 'I always avoid disposables and prefer durable bottles, bags and cups', 'Sempre evito produtos descartáveis, prefiro garrafas, ecobags e copos duráveis'),
    ],
    tip: {
      en: 'Carry a reusable kit: water bottle, tote bag and cup. It replaces hundreds of disposables per year.',
      pt: 'Leve um kit reutilizável: garrafa, ecobag e copo. Ele substitui centenas de descartáveis por ano.',
    },
    impact: { en: 'Avoids ~500 disposable items per year', pt: 'Evita ~500 itens descartáveis por ano' },
  },
  {
    id: 10,
    category: { en: 'Awareness', pt: 'Conscientização' },
    question: {
      en: 'Do you share knowledge about sustainability with other people?',
      pt: 'Você compartilha conhecimentos sobre sustentabilidade com outras pessoas?',
    },
    options: [
      opt('A', 0, "Never, I don't get involved", 'Nunca, não me envolvo com isso'),
      opt('B', 1, 'Rarely', 'Raramente'),
      opt('C', 2, 'Sometimes I talk about it', 'Às vezes, converso sobre o assunto'),
      opt('D', 3, 'Yes, I actively promote sustainable practices', 'Sim, ativamente promovo práticas sustentáveis'),
    ],
    tip: {
      en: 'Share your sustainable practices on social media and inspire friends and family to do the same.',
      pt: 'Compartilhe suas práticas sustentáveis nas redes sociais e inspire amigos e família a fazerem o mesmo.',
    },
    impact: { en: 'Multiplies the positive impact', pt: 'Multiplica o impacto positivo' },
  },
];

export const MAX_POINTS = forms.length * 3;

export const levels: { min: number; key: string; name: Localized; description: Localized }[] = [
  {
    min: 90,
    key: 'expert',
    name: { en: 'Expert', pt: 'Expert' },
    description: {
      en: 'You are a sustainability reference! Keep inspiring the people around you.',
      pt: 'Você é uma referência em sustentabilidade! Continue inspirando as pessoas ao seu redor.',
    },
  },
  {
    min: 70,
    key: 'advanced',
    name: { en: 'Advanced', pt: 'Avançado' },
    description: {
      en: 'Great job! Sustainable habits are already part of your routine.',
      pt: 'Ótimo trabalho! Hábitos sustentáveis já fazem parte da sua rotina.',
    },
  },
  {
    min: 50,
    key: 'committed',
    name: { en: 'Committed', pt: 'Comprometido' },
    description: {
      en: 'You are committed to sustainability and have already adopted several eco-friendly habits!',
      pt: 'Você está comprometido com a sustentabilidade e já adotou vários hábitos eco-friendly!',
    },
  },
  {
    min: 25,
    key: 'aware',
    name: { en: 'Aware', pt: 'Consciente' },
    description: {
      en: 'You are aware of the impact of your choices. Time to turn awareness into habits!',
      pt: 'Você tem consciência do impacto das suas escolhas. Hora de transformar consciência em hábitos!',
    },
  },
  {
    min: 0,
    key: 'beginner',
    name: { en: 'Beginner', pt: 'Iniciante' },
    description: {
      en: 'Every journey starts with one step — and One Step Drives All. Small changes make a big difference!',
      pt: 'Toda jornada começa com um passo — e One Step Drives All. Pequenas mudanças fazem grande diferença!',
    },
  },
];

export function scoreAnswers(answers: Record<string, string>) {
  let points = 0;
  for (const q of forms) {
    const option = q.options.find((o) => o.id === answers[String(q.id)]);
    points += option?.points ?? 0;
  }
  const score = Math.round((points / MAX_POINTS) * 100);
  const level = levels.find((l) => score >= l.min) ?? levels[levels.length - 1];
  return { score, level: level.key };
}
