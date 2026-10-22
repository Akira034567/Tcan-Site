export type Founder = {
  id: 'tricia' | 'ricardo';
  name: string;
  firstName: string;
  role: string;
  headline: string;
  bioShort: string;
  bioLong: string[];
  education: { institution: string; course: string }[];
  sectors: string[];
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  linkedin: string;
  linkedinLabel: string;
  quote: string;
};

export const founders: Founder[] = [
  {
    id: 'tricia',
    name: 'Trícia Cristilli',
    firstName: 'Trícia',
    role: 'Sócia Diretora',
    headline: 'Head de Consultoria de Negócios',
    bioShort:
      'Executiva de Marketing & Comunicação com cerca de 35 anos em estratégia, canais de vendas e posicionamento de marcas.',
    bioLong: [
      'Publicitária, pós-graduada em Marketing pela FAAP e com especialização em Gestão de Negócios pelo IESE – Universidade de Navarra (Madri, Espanha).',
      'São cerca de 35 anos na elaboração e implementação de estratégias de marketing, comunicação e canais de vendas, além de lançamentos e reposicionamentos de marca para organizações de serviços.',
    ],
    education: [
      { institution: 'FAAP', course: 'Publicidade e pós-graduação em Marketing' },
      { institution: 'IESE – Universidade de Navarra', course: 'Especialização em Gestão de Negócios' },
    ],
    sectors: ['Energia renovável', 'Saúde e bem-estar', 'Telecom', 'Serviços financeiros'],
    phoneDisplay: '(11) 99600-0721',
    phoneE164: '5511996000721',
    email: 'tricia@tcan.com.br',
    linkedin: 'https://www.linkedin.com/in/tricia-cristilli',
    linkedinLabel: 'Trícia Cristilli',
    quote:
      'Nosso compromisso é assumir a missão do negócio do parceiro para garantir o alcance dos seus objetivos e metas.',
  },
  {
    id: 'ricardo',
    name: 'Ricardo Watanabe',
    firstName: 'Ricardo',
    role: 'Sócio Diretor',
    headline: 'Sócio Executivo',
    bioShort:
      'Executivo de negócios com 35 anos em grandes empresas, especialista em novos canais de vendas, finanças e inteligência de mercado.',
    bioLong: [
      'Administrador de Empresas pela FGV, pós-graduado em Marketing pelo CEAG-FGV e em Gestão de Negócios pelo IESE – Universidade de Navarra (Madri, Espanha).',
      'Construiu carreira em grandes operadoras de telecomunicações e instituições financeiras, criando novos canais de vendas. Foi sócio de uma empresa de fomento mercantil e atua como consultor em finanças, planejamento estratégico, inteligência de mercado e marketing.',
    ],
    education: [
      { institution: 'FGV', course: 'Administração de Empresas' },
      { institution: 'CEAG-FGV', course: 'Pós-graduação em Marketing' },
      { institution: 'IESE – Universidade de Navarra', course: 'Gestão de Negócios' },
    ],
    sectors: ['Telecom', 'Serviços financeiros', 'Canais de vendas', 'Planejamento estratégico'],
    phoneDisplay: '(11) 99619-5800',
    phoneE164: '5511996195800',
    email: 'rwatanabe@tcan.com.br',
    linkedin: 'https://www.linkedin.com/in/ricardo-eidi-watanabe',
    linkedinLabel: 'Ricardo Watanabe',
    quote: 'Nosso diferencial é colocar a mão na massa, sentando na cadeira executiva, com olhar de dono.',
  },
];

export const founderById = (id: Founder['id']) => founders.find((f) => f.id === id)!;
