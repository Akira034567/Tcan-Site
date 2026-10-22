/** Route metadata: titles, descriptions, breadcrumbs. Pillar pages are added from pillars.ts. */
import { pillars } from './pillars.ts';

export type Crumb = { name: string; path: string };
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Short title for the Open Graph image. */
  ogTitle: string;
  ogEyebrow?: string;
  noindex?: boolean;
  breadcrumb?: Crumb[];
};

const home: Crumb = { name: 'Início', path: '/' };
const solucoes: Crumb = { name: 'Soluções', path: '/solucoes/' };

export const pages: PageMeta[] = [
  {
    path: '/',
    title: 'TCAN | Assessoria de negócios com olhar de dono',
    description:
      'Estratégia de negócio e hub de conexões: a TCAN une sócios com 35 anos de mercado a especialistas em marca, inovação, ESG e pessoas para ticar suas metas.',
    ogTitle: 'Assessoria de negócios com olhar de dono',
    ogEyebrow: 'Estratégia de Negócio & Hub de Conexões',
  },
  {
    path: '/sobre/',
    title: 'Quem somos | TCAN Assessoria de Negócios',
    description:
      'Conheça a TCAN, os sócios Trícia Cristilli e Ricardo Watanabe e o método que combina estratégia, mão na massa e um ecossistema de especialistas.',
    ogTitle: 'Quem somos',
    ogEyebrow: 'TCAN Assessoria de Negócios',
    breadcrumb: [home, { name: 'Quem somos', path: '/sobre/' }],
  },
  {
    path: '/solucoes/',
    title: 'Soluções empresariais | TCAN Assessoria de Negócios',
    description:
      'Quatro frentes e doze soluções integradas: marca e experiência, inovação e negócios, ESG e inovação sustentável, pessoas e performance.',
    ogTitle: 'Ecossistema de Soluções Empresariais',
    ogEyebrow: 'Soluções',
    breadcrumb: [home, solucoes],
  },
  ...pillars.map(
    (p): PageMeta => ({
      path: `/solucoes/${p.slug}/`,
      title: p.seo.title,
      description: p.seo.description,
      ogTitle: p.name,
      ogEyebrow: 'Soluções TCAN',
      breadcrumb: [home, solucoes, { name: p.name, path: `/solucoes/${p.slug}/` }],
    }),
  ),
  {
    path: '/contato/',
    title: 'Contato | TCAN Assessoria de Negócios',
    description:
      'Fale direto com os sócios da TCAN por WhatsApp, e-mail ou formulário e conte o desafio da sua empresa.',
    ogTitle: 'Fale com um sócio',
    ogEyebrow: 'Contato',
    breadcrumb: [home, { name: 'Contato', path: '/contato/' }],
  },
  {
    path: '/contato/obrigado/',
    title: 'Mensagem enviada | TCAN Assessoria de Negócios',
    description: 'Recebemos sua mensagem. Um sócio da TCAN vai responder em breve.',
    ogTitle: 'Mensagem enviada',
    noindex: true,
    breadcrumb: [home, { name: 'Contato', path: '/contato/' }, { name: 'Mensagem enviada', path: '/contato/obrigado/' }],
  },
  {
    path: '/politica-de-privacidade/',
    title: 'Política de Privacidade | TCAN Assessoria de Negócios',
    description: 'Como a TCAN trata dados pessoais conforme a LGPD: quais dados, para quê, por quanto tempo e seus direitos.',
    ogTitle: 'Política de Privacidade',
    breadcrumb: [home, { name: 'Política de Privacidade', path: '/politica-de-privacidade/' }],
  },
  {
    path: '/politica-de-cookies/',
    title: 'Política de Cookies | TCAN Assessoria de Negócios',
    description: 'Quais cookies o site da TCAN usa, para quê, por quanto tempo e como mudar suas preferências.',
    ogTitle: 'Política de Cookies',
    breadcrumb: [home, { name: 'Política de Cookies', path: '/politica-de-cookies/' }],
  },
  {
    path: '/termos-de-uso/',
    title: 'Termos de Uso | TCAN Assessoria de Negócios',
    description: 'Condições de uso do site da TCAN Assessoria de Negócios.',
    ogTitle: 'Termos de Uso',
    breadcrumb: [home, { name: 'Termos de Uso', path: '/termos-de-uso/' }],
  },
  {
    path: '/acessibilidade/',
    title: 'Acessibilidade | TCAN Assessoria de Negócios',
    description: 'Compromisso da TCAN com a acessibilidade digital (WCAG 2.2 AA e Lei Brasileira de Inclusão) e como relatar barreiras.',
    ogTitle: 'Acessibilidade',
    breadcrumb: [home, { name: 'Acessibilidade', path: '/acessibilidade/' }],
  },
  {
    path: '/404/',
    title: 'Página não encontrada | TCAN Assessoria de Negócios',
    description: 'A página que você procurou não existe ou mudou de endereço.',
    ogTitle: 'Página não encontrada',
    noindex: true,
  },
];

export const pageMeta = (path: string): PageMeta => {
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`No page metadata for ${path}`);
  return page;
};

export const ogSlug = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '--'));
