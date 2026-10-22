/** Cookies the site can set. Keep in sync with the consent dialog and the cookie policy. */
export const consentCookie = { name: 'tcan_consent', maxAgeDays: 180 };

/** GA4 cookie lifetime we configure (13 months, below Google's 2-year default). */
export const gaCookieDays = 395;

export const cookieTable = [
  {
    name: consentCookie.name,
    provider: 'TCAN (primeira parte)',
    category: 'Necessário',
    purpose: 'Guarda a sua escolha sobre cookies para não perguntarmos de novo a cada página.',
    duration: '6 meses',
    transfer: 'Não',
  },
  {
    name: '_ga',
    provider: 'Google LLC (Google Analytics 4)',
    category: 'Estatístico',
    purpose: 'Distingue visitantes de forma pseudonimizada para medir visitas e uso das páginas.',
    duration: '13 meses',
    transfer: 'Sim (EUA)',
  },
  {
    name: '_ga_<ID>',
    provider: 'Google LLC (Google Analytics 4)',
    category: 'Estatístico',
    purpose: 'Mantém o estado da sessão para a medição de uso.',
    duration: '13 meses',
    transfer: 'Sim (EUA)',
  },
];
