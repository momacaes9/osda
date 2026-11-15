import { forms, levels, type Language } from '../../data/forms.js';
import type { ChatMessage } from './ai.service.js';

/**
 * Built-in assistant used when no AI key is configured (or the provider fails),
 * so the chatbot and the questionnaire analysis always work.
 */
const topics: { keywords: string[]; en: string; pt: string }[] = [
  {
    keywords: ['transport', 'car', 'bike', 'bus', 'carro', 'bicicleta', 'ônibus', 'onibus', 'transporte'],
    en: '🚲 Transport is one of the biggest sources of personal emissions. Try walking or cycling for short trips, use public transport twice a week and share rides when you can. That can cut up to 2 tonnes of CO2 per year!',
    pt: '🚲 O transporte é uma das maiores fontes de emissões pessoais. Tente caminhar ou pedalar em trajetos curtos, usar transporte público 2 vezes por semana e dar carona quando puder. Isso pode reduzir até 2 toneladas de CO2 por ano!',
  },
  {
    keywords: ['energy', 'electric', 'light', 'energia', 'luz', 'eletric', 'tomada'],
    en: '💡 Unplug devices you are not using, switch to LED bulbs and use natural light during the day. Power strips with a switch make it easy — you can save up to 10% on your energy bill.',
    pt: '💡 Tire da tomada os aparelhos que não está usando, troque para lâmpadas LED e aproveite a luz natural. Filtros de linha com interruptor facilitam — você pode economizar até 10% na conta de luz.',
  },
  {
    keywords: ['battery', 'batteries', 'pilha', 'bateria', 'eletrônico', 'eletronico', 'e-waste'],
    en: '🔋 Never throw batteries in the regular trash — they leak heavy metals. Keep a small box at home and drop them at a collection point (supermarkets and electronics stores usually have one).',
    pt: '🔋 Nunca jogue pilhas no lixo comum — elas liberam metais pesados. Tenha uma caixinha em casa e leve a um ponto de coleta (supermercados e lojas de eletrônicos costumam ter).',
  },
  {
    keywords: ['recycl', 'trash', 'waste', 'garbage', 'compost', 'recicl', 'lixo', 'resíduo', 'residuo', 'composta'],
    en: '♻️ Start with two bins: recyclables and organic waste. Rinse packaging before recycling and try composting food scraps — it can halve your household waste.',
    pt: '♻️ Comece com duas lixeiras: recicláveis e orgânicos. Lave as embalagens antes de reciclar e experimente compostar restos de comida — isso pode reduzir pela metade o lixo de casa.',
  },
  {
    keywords: ['food', 'meat', 'vegan', 'vegetarian', 'diet', 'comida', 'carne', 'vegano', 'vegetariano', 'alimenta'],
    en: '🥗 Food matters! Try one or two meat-free days per week, buy local and seasonal produce and plan meals to avoid waste.',
    pt: '🥗 A alimentação faz diferença! Experimente 1 ou 2 dias sem carne por semana, compre produtos locais e da estação e planeje as refeições para evitar desperdício.',
  },
  {
    keywords: ['plastic', 'bottle', 'bag', 'plástico', 'plastico', 'garrafa', 'sacola', 'copo'],
    en: '🥤 Carry a reusable kit: water bottle, tote bag and cup. It replaces hundreds of disposable items per year.',
    pt: '🥤 Leve um kit reutilizável: garrafa, ecobag e copo. Ele substitui centenas de descartáveis por ano.',
  },
  {
    keywords: ['water', 'água', 'agua', 'shower', 'banho', 'chuva', 'rain'],
    en: '💧 Take shorter showers, fix leaks and collect rainwater for plants and cleaning. A 5-minute shower saves up to 90 litres compared to a 15-minute one.',
    pt: '💧 Tome banhos mais curtos, conserte vazamentos e reaproveite a água da chuva para plantas e limpeza. Um banho de 5 minutos economiza até 90 litros em relação a um de 15.',
  },
  {
    keywords: ['cloth', 'fashion', 'shop', 'buy', 'roupa', 'moda', 'compr', 'brechó', 'brecho', 'thrift'],
    en: '👕 Before buying, ask: do I really need it? Try thrift stores, swaps and repairing what you have. Fast fashion is responsible for about 10% of global emissions.',
    pt: '👕 Antes de comprar, pergunte-se: preciso mesmo? Experimente brechós, trocas e consertar o que já tem. A moda rápida responde por cerca de 10% das emissões globais.',
  },
];

export function offlineChatAnswer(messages: ChatMessage[], language: Language): string {
  const last = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() ?? '';
  const isPt = language === 'pt';
  const topic = topics.find((t) => t.keywords.some((k) => last.includes(k)));
  if (topic) return isPt ? topic.pt : topic.en;
  if (/^(hi|hello|hey|oi|olá|ola|bom dia|boa tarde|boa noite)\b/.test(last)) {
    return isPt
      ? '👋 Olá! Sou o assistente de sustentabilidade da OSDA. Pergunte sobre transporte, energia, reciclagem, alimentação, plástico, água ou consumo consciente! 🌱'
      : "👋 Hi! I'm the OSDA sustainability assistant. Ask me about transport, energy, recycling, food, plastic, water or conscious shopping! 🌱";
  }
  return isPt
    ? '🌱 Ótima pergunta! Algumas ações de alto impacto: usar transporte ativo ou público, reduzir carne vermelha, separar o lixo, evitar plástico descartável e tirar aparelhos da tomada. Quer dicas sobre algum desses temas? (Dica: faça o questionário da OSDA para receber recomendações personalizadas!)'
    : '🌱 Great question! Some high-impact actions: walk, cycle or take public transport, eat less red meat, sort your waste, avoid single-use plastic and unplug idle devices. Want tips on any of these? (Tip: take the OSDA questionnaire for personalized recommendations!)';
}

export function offlineQuestionnaireAnswer(
  answers: Record<string, string>,
  score: number,
  language: Language,
): string {
  const level = levels.find((l) => score >= l.min) ?? levels[levels.length - 1];
  const weakest = forms
    .map((q) => ({ q, points: q.options.find((o) => o.id === answers[String(q.id)])?.points ?? 0 }))
    .sort((a, b) => a.points - b.points)
    .slice(0, 4);
  const intro =
    language === 'pt'
      ? `🌍 Sua pontuação é ${score}/100 (${level.name.pt}). ${level.description.pt}`
      : `🌍 Your score is ${score}/100 (${level.name.en}). ${level.description.en}`;
  const tips = weakest
    .map(({ q }, i) => `${i + 1}. ${q.category[language]}: ${q.tip[language]} (${q.impact[language]})`)
    .join('\n');
  const outro =
    language === 'pt'
      ? '💚 Lembre-se: Um Passo Impulsiona Tudo. Escolha uma dica para começar esta semana!'
      : '💚 Remember: One Step Drives All. Pick one tip to start this week!';
  return `${intro}\n\n${tips}\n\n${outro}`;
}
