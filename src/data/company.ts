import { todo, type Maybe } from '../lib/placeholder.ts';

export const company = {
  tradeName: 'TCAN Assessoria de Negócios',
  shortName: 'TCAN',
  legalName: todo('Razão social', 'Razão social a confirmar') as Maybe<string>,
  cnpj: todo('CNPJ', '00.000.000/0001-00') as Maybe<string>,
  address: {
    street: todo('Endereço', 'Endereço a confirmar') as Maybe<string>,
    city: todo('Cidade', 'São Paulo') as Maybe<string>,
    state: todo('UF', 'SP') as Maybe<string>,
    postalCode: todo('CEP', '00000-000') as Maybe<string>,
  },
  email: todo('E-mail geral', 'contato@tcan.com.br') as Maybe<string>,
  privacyEmail: todo('Canal de privacidade (LGPD)', 'privacidade@tcan.com.br') as Maybe<string>,
  /** Encarregado (DPO). Optional for small businesses (Res. CD/ANPD 2/2022, art. 11); the channel above is mandatory. */
  encarregado: null as Maybe<string> | null,
  /** Set a network to null to omit it on purpose. */
  socials: {
    linkedin: todo('LinkedIn da empresa', 'https://www.linkedin.com/company/tcan') as Maybe<string> | null,
    instagram: todo('Instagram da empresa', 'https://www.instagram.com/tcan') as Maybe<string> | null,
  },
  tagline: 'Estratégia de Negócio & Hub de Conexões',
  signature: 'Seguimos ticando suas metas',
  pitch:
    'Conectamos empresas, marcas, pessoas e soluções para transformar desafios em oportunidades, e oportunidades em impacto.',
  description:
    'Assessoria de negócios que une estratégia com olhar de dono a um ecossistema de especialistas em marca, inovação, ESG e pessoas.',
  /** Founder who answers each topic first (form fallback and WhatsApp CTAs). */
  routing: { marca: 'tricia', inovacao: 'ricardo', esg: 'ricardo', pessoas: 'tricia', default: 'ricardo' } as const,
  replyTime: todo('Prazo de resposta', 'em até 1 dia útil') as Maybe<string>,
  policiesUpdated: '2026-10-22',
  /** Set to true only after a lawyer has reviewed the privacy, cookie and terms pages. */
  legalReviewed: false,
  /** Bump when the cookie policy changes: visitors are asked again. */
  policyVersion: 1,
};

export const env = {
  ga4Id: (import.meta.env.PUBLIC_GA4_ID as string | undefined) || null,
  contactEndpoint: (import.meta.env.PUBLIC_CONTACT_ENDPOINT as string | undefined) || null,
  indexing: import.meta.env.PUBLIC_INDEXING === 'true',
};

/** Sectors served (shown instead of client logos, which need written authorization). */
export const sectors = [
  { name: 'Telecomunicações', icon: 'radio-tower' },
  { name: 'Serviços financeiros', icon: 'landmark' },
  { name: 'Varejo e franquias', icon: 'store' },
  { name: 'Alimentação e food service', icon: 'utensils' },
  { name: 'Saúde e bem-estar', icon: 'heart-pulse' },
  { name: 'Energia', icon: 'zap' },
  { name: 'Bens de consumo e beleza', icon: 'sparkles' },
  { name: 'Tecnologia', icon: 'cpu' },
] as const;
