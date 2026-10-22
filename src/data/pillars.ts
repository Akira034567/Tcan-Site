/**
 * Ecosystem content: 4 pillars × 3 solutions.
 * Original copy (no partner names, no figures, no promised results). Every solution stays
 * `draft` until the founders approve it; `npm run check:release` blocks drafts.
 */
import type { IconName } from '../lib/icons.ts';

export type ReviewStatus = 'draft' | 'approved';

export type Solution = {
  id: string;
  /** In-page anchor on the pillar page. */
  anchor: string;
  name: string;
  icon: IconName;
  summary: string;
  body: string[];
  deliverables: string[];
  formats: string[];
  outcomes: string[];
  keywords: string[];
  reviewStatus: ReviewStatus;
};

export type Pillar = {
  id: 'marca' | 'inovacao' | 'esg' | 'pessoas';
  slug: string;
  name: string;
  icon: IconName;
  tagline: string;
  summary: string;
  challenges: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
  solutions: Solution[];
};

const draft: ReviewStatus = 'draft';

export const pillars: Pillar[] = [
  {
    id: 'marca',
    slug: 'marca-cultura-experiencia',
    name: 'Marca, Cultura & Experiência',
    icon: 'sparkles',
    tagline: 'Marcas coerentes por dentro e memoráveis por fora.',
    summary:
      'Estratégia de marca, cultura, eventos e ponto de venda conectados para que a empresa transmita o mesmo valor em cada contato com o time, o cliente e o mercado.',
    challenges: [
      'Marca sem posicionamento claro, percebida de formas diferentes por cada público',
      'Valores e cultura que não aparecem no dia a dia das equipes',
      'Eventos e ações internas pontuais, sem fio condutor estratégico',
      'Lojas que perdem o padrão da marca à medida que a rede cresce',
    ],
    faq: [
      {
        q: 'Posso contratar apenas uma frente, como um evento ou um projeto de loja?',
        a: 'Sim. Cada solução pode ser contratada de forma independente. Quando faz sentido, conectamos as frentes para manter a mesma linguagem entre marca, cultura, eventos e ponto de venda.',
      },
      {
        q: 'Como funciona o trabalho com o ecossistema de especialistas?',
        a: 'A TCAN conduz o diagnóstico, desenha o escopo e coordena os especialistas mais adequados a cada projeto. Você tem um único ponto de contato do início ao fim.',
      },
      {
        q: 'É possível usar leis de incentivo em patrocínios?',
        a: 'Em muitos casos, sim. A viabilidade depende do regime tributário da empresa, do enquadramento do projeto e das regras de cada mecanismo de incentivo à cultura ou ao esporte. Avaliamos esses pontos antes de qualquer recomendação.',
      },
    ],
    seo: {
      title: 'Branding, endomarketing e trade marketing | TCAN',
      description:
        'Estratégia de marca e cultura, eventos corporativos, endomarketing, patrocínios e trade marketing no PDV, conduzidos pela TCAN com especialistas.',
    },
    solutions: [
      {
        id: 'marca-comunicacao',
        anchor: 'marca-cultura-comunicacao',
        name: 'Marca, Cultura & Comunicação',
        icon: 'megaphone',
        summary:
          'Propósito, posicionamento e cultura traduzidos em uma comunicação coerente, que fortalece a marca dentro e fora da empresa.',
        body: [
          'Uma marca forte começa por dentro. A TCAN conduz, com nosso ecossistema de especialistas, o diagnóstico de marca e de cultura e a definição de propósito, posicionamento, valores e tom de voz. É a base para que a liderança, as equipes e o mercado reconheçam a mesma empresa.',
          'Em seguida, levamos essa estratégia para a rotina: identidade visual, guias de comportamento, campanhas internas, conteúdo, audiovisual e relacionamento com a imprensa. Os materiais são produzidos sob demanda e mantêm a mesma linguagem em todos os pontos de contato.',
        ],
        deliverables: [
          'Diagnóstico de marca e de cultura',
          'Propósito, posicionamento e arquitetura de marca',
          'Identidade visual e guia de marca',
          'Valores, rituais e guia de comportamentos',
          'Campanhas de comunicação interna e conteúdo',
          'Assessoria de imprensa e produção audiovisual',
        ],
        formats: ['Projeto sob medida', 'Workshops de cocriação com a liderança', 'Produção de materiais sob demanda', 'Palestras sobre marca e cultura'],
        outcomes: [
          'Mais clareza sobre o que a marca representa e como deve se expressar',
          'Cultura mais presente nas decisões e na rotina das equipes',
          'Comunicação consistente entre públicos internos e externos',
          'Lideranças mais preparadas para sustentar a mudança',
        ],
        keywords: ['consultoria de branding', 'estratégia de marca para empresas', 'cultura organizacional', 'comunicação interna corporativa', 'posicionamento de marca'],
        reviewStatus: draft,
      },
      {
        id: 'brand-experience',
        anchor: 'brand-experience-endomarketing',
        name: 'Brand Experience & Endomarketing',
        icon: 'party-popper',
        summary:
          'Eventos, convenções, ativações, patrocínios e endomarketing planejados para aproximar a marca de colaboradores, clientes e parceiros.',
        body: [
          'Experiências bem planejadas criam vínculo. A TCAN reúne especialistas para conceber e produzir eventos corporativos, congressos, convenções, feiras, lançamentos e ativações de marca, presenciais ou híbridos, do roteiro criativo à operação no dia.',
          'A mesma lógica vale para o público interno, com campanhas de endomarketing, programas de incentivo e reconhecimento, brindes personalizados e atrações de entretenimento. Também apoiamos a estruturação de patrocínios, inclusive por meio de leis de incentivo à cultura e ao esporte, quando o projeto e a empresa se enquadram.',
        ],
        deliverables: [
          'Concepção e produção de eventos e convenções',
          'Ativações de marca e ações de live marketing',
          'Campanhas de endomarketing e programas de incentivo',
          'Estruturação de patrocínios e projetos incentivados',
          'Brindes personalizados e curadoria de entretenimento',
          'Cobertura em foto e vídeo',
        ],
        formats: ['Projeto sob medida por evento', 'Calendário anual de ações', 'Presencial, híbrido ou online'],
        outcomes: [
          'Colaboradores mais conectados à estratégia e aos valores da empresa',
          'Relacionamento mais próximo com clientes e parceiros',
          'Patrocínios alinhados ao posicionamento da marca',
          'Ações integradas, com um único ponto de coordenação',
        ],
        keywords: ['agência de eventos corporativos', 'endomarketing para empresas', 'convenção de vendas', 'patrocínio via lei de incentivo', 'brindes corporativos personalizados'],
        reviewStatus: draft,
      },
      {
        id: 'trade-pdv',
        anchor: 'trade-marketing-pdv',
        name: 'Trade Marketing & PDV',
        icon: 'store',
        summary:
          'Arquitetura comercial, store design e visual merchandising para lojas que expressam a marca e mantêm o padrão na expansão.',
        body: [
          'O ponto de venda é onde a marca encontra o cliente. A TCAN conecta especialistas em arquitetura comercial, store design e visual merchandising para criar o conceito arquitetônico da marca e transformá-lo em projetos de loja funcionais e coerentes.',
          'Na expansão, cuidamos da replicação do projeto padrão e da gestão de obras, com orçamento, cronograma, qualidade de execução e coordenação com fornecedores, franqueados e shoppings. Completam a frente as ações promocionais e os materiais de merchandising no PDV.',
        ],
        deliverables: [
          'Conceito arquitetônico da marca',
          'Projeto de arquitetura comercial e store design',
          'Visual merchandising e vitrinismo',
          'Gerenciamento e administração de obras',
          'Replicação do projeto padrão para novas unidades',
          'Ações promocionais e materiais de PDV',
        ],
        formats: ['Projeto sob medida', 'Programa de expansão de rede', 'Acompanhamento de obra até a inauguração'],
        outcomes: [
          'Lojas que comunicam a marca com mais clareza',
          'Padrão visual consistente entre unidades',
          'Mais previsibilidade de prazos e custos nas obras',
          'Exposição de produtos que facilita a jornada de compra',
        ],
        keywords: ['arquitetura comercial para varejo', 'store design', 'visual merchandising', 'projeto de loja para franquia', 'gerenciamento de obras de lojas'],
        reviewStatus: draft,
      },
    ],
  },
  {
    id: 'inovacao',
    slug: 'inovacao-negocios',
    name: 'Inovação & Negócios',
    icon: 'lightbulb',
    tagline: 'Estratégia, tecnologia e finanças a serviço de decisões melhores.',
    summary:
      'Planejamento estratégico, inteligência de mercado, tecnologia com IA e soluções financeiras e tributárias para crescer com mais clareza, eficiência e controle.',
    challenges: [
      'Decisões tomadas sem dados confiáveis de mercado e de cliente',
      'Planos comerciais que não saem do papel por falta de método ou de equipe',
      'Projetos de tecnologia e IA sem prioridade nem time definidos',
      'Custo de capital e carga tributária pesando no resultado',
    ],
    faq: [
      {
        q: 'Preciso ter um projeto de IA definido para começar?',
        a: 'Não. Partimos do problema de negócio para identificar onde a tecnologia e a IA fazem sentido. Só depois definimos escopo, time e formato de entrega.',
      },
      {
        q: 'A TCAN substitui a minha área de planejamento ou de marketing?',
        a: 'Não necessariamente. Podemos apoiar um projeto pontual, acompanhar a implementação por etapas ou atuar como extensão do seu time, conforme a necessidade.',
      },
      {
        q: 'A TCAN concede crédito diretamente?',
        a: 'Não. A TCAN conecta a sua empresa a especialistas e instituições parceiras. As condições de cada operação dependem de análise e são definidas por quem oferece o produto.',
      },
    ],
    seo: {
      title: 'Gestão de negócios, IA e soluções financeiras | TCAN',
      description:
        'Planejamento estratégico, inteligência de mercado, desenvolvimento de software com IA e soluções financeiras e tributárias para empresas.',
    },
    solutions: [
      {
        id: 'gestao',
        anchor: 'gestao-de-negocio',
        name: 'Gestão de Negócio',
        icon: 'chart-line',
        summary:
          'Planejamento estratégico, inteligência de mercado e gestão comercial com método, do diagnóstico ao acompanhamento de indicadores.',
        body: [
          'Crescer exige escolhas bem fundamentadas. A TCAN, com seu ecossistema de especialistas, combina pesquisa qualitativa e quantitativa, inteligência de mercado e análise de cenários para apoiar decisões sobre portfólio, preço, canais, segmentação e novos negócios.',
          'Depois do diagnóstico e do plano vem a implementação: lançamentos, campanhas de incentivo, estrutura comercial, definição de indicadores e acompanhamento de resultados. O formato se adapta ao momento da empresa, de um projeto pontual à atuação contínua como extensão do seu time.',
        ],
        deliverables: [
          'Diagnóstico de negócio e de mercado',
          'Pesquisas qualitativas e quantitativas',
          'Planejamento estratégico e plano de negócios',
          'Estratégia comercial, de canais e de preço',
          'Indicadores de desempenho e rotina de acompanhamento',
          'Planos de lançamento e campanhas de incentivo',
        ],
        formats: ['Projeto pontual', 'Acompanhamento por etapas', 'Atuação contínua como extensão do time'],
        outcomes: [
          'Decisões apoiadas em dados de mercado e de cliente',
          'Prioridades claras e plano com responsáveis definidos',
          'Resultados acompanhados com indicadores objetivos',
          'Mais alinhamento entre estratégia e execução comercial',
        ],
        keywords: ['consultoria de gestão empresarial', 'planejamento estratégico para empresas', 'pesquisa de mercado', 'inteligência de mercado', 'consultoria comercial'],
        reviewStatus: draft,
      },
      {
        id: 'ia-sva',
        anchor: 'solucoes-tecnologicas-ia-sva',
        name: 'Soluções Tecnológicas: IA & SVA',
        icon: 'bot',
        summary:
          'Desenvolvimento de software, inteligência artificial e serviços de valor agregado para modernizar operações e ampliar a oferta ao cliente.',
        body: [
          'Tecnologia precisa resolver problemas de negócio. A TCAN conecta a sua empresa a especialistas em desenvolvimento de software, com times ágeis multidisciplinares, projetos de escopo fechado e uso de inteligência artificial para acelerar as etapas de produto, da ideia à plataforma em operação.',
          'Também estruturamos serviços de valor agregado (SVA), como saúde digital, que podem compor produtos e planos da sua empresa. A frente inclui ainda o recrutamento de profissionais de tecnologia para reforçar o seu time.',
        ],
        deliverables: [
          'Times ágeis de desenvolvimento sob demanda',
          'Projetos de software com escopo e prazo definidos',
          'Aplicação de IA em produtos e processos',
          'Serviços de valor agregado (SVA) para compor ofertas',
          'Recrutamento de profissionais de tecnologia',
        ],
        formats: ['Alocação de times ágeis', 'Projeto de escopo fechado', 'Consultoria e mentoria técnica'],
        outcomes: [
          'Iniciativas de tecnologia com escopo e prioridade definidos',
          'Mais agilidade para tirar ideias do papel',
          'Ofertas mais completas para os seus clientes',
          'Acesso a competências técnicas especializadas conforme a demanda',
        ],
        keywords: ['desenvolvimento de software sob demanda', 'inteligência artificial para empresas', 'serviços de valor agregado SVA', 'squad ágil terceirizado'],
        reviewStatus: draft,
      },
      {
        id: 'financeiras',
        anchor: 'solucoes-financeiras-tributarias',
        name: 'Soluções Financeiras e Tributárias',
        icon: 'landmark',
        summary:
          'Conexão com alternativas de crédito e apoio tributário especializado para decisões financeiras e fiscais mais seguras.',
        body: [
          'Capital e tributos pesam diretamente no resultado. A TCAN conecta a sua empresa a especialistas e instituições parceiras para avaliar alternativas de crédito empresarial adequadas ao momento e à estrutura do negócio, sempre com análise prévia e condições definidas por quem oferece cada operação.',
          'Na frente tributária, o ecossistema apoia o diagnóstico da carga fiscal, a revisão de procedimentos e a identificação de oportunidades legais de recuperação de créditos e de planejamento, com acompanhamento técnico em cada etapa.',
        ],
        deliverables: [
          'Diagnóstico financeiro e de necessidade de capital',
          'Conexão com alternativas de crédito empresarial',
          'Diagnóstico tributário',
          'Revisão fiscal e identificação de créditos recuperáveis',
          'Planejamento tributário dentro da legislação',
        ],
        formats: ['Diagnóstico inicial', 'Projeto sob medida', 'Acompanhamento contínuo'],
        outcomes: [
          'Visão mais clara das alternativas de financiamento',
          'Mais segurança nas decisões fiscais',
          'Oportunidades tributárias mapeadas com base técnica',
          'Decisões financeiras alinhadas à estratégia do negócio',
        ],
        keywords: ['crédito para empresas', 'recuperação de créditos tributários', 'planejamento tributário empresarial', 'consultoria tributária', 'capital de giro para empresas'],
        reviewStatus: draft,
      },
    ],
  },
  {
    id: 'esg',
    slug: 'esg-inovacao-sustentavel',
    name: 'ESG & Inovação Sustentável',
    icon: 'leaf',
    tagline: 'Sustentabilidade que se mede, se gerencia e gera valor ao negócio.',
    summary:
      'Eficiência hídrica, saúde corporativa e nanotecnologia aplicadas com método e acompanhamento para transformar compromissos ESG em ações concretas e mensuráveis.',
    challenges: [
      'Consumo de água e energia sem visibilidade nem controle',
      'Desperdícios e vazamentos identificados tarde demais',
      'Saúde mental das equipes e as exigências da NR-1 sobre riscos psicossociais',
      'Dificuldade de levar inovação científica para produtos e processos',
    ],
    faq: [
      {
        q: 'É preciso investir em equipamentos para começar um projeto de eficiência hídrica?',
        a: 'Há diferentes modelos comerciais, inclusive opções sem investimento inicial, em que a remuneração está atrelada à economia gerada. O modelo mais adequado é definido depois do diagnóstico.',
      },
      {
        q: 'A solução de saúde corporativa ajuda na adequação à NR-1?',
        a: 'Ela apoia a identificação e a avaliação dos riscos psicossociais e oferece ações de cuidado e prevenção. A gestão dos riscos ocupacionais continua sendo responsabilidade da empresa e de seus profissionais de segurança e saúde no trabalho.',
      },
      {
        q: 'A nanotecnologia se aplica ao meu setor?',
        a: 'Ela tem aplicações em materiais e plásticos, tratamento de água, agronegócio, cuidado pessoal e saúde animal, entre outros. A viabilidade é avaliada caso a caso, com testes e caracterização.',
      },
    ],
    seo: {
      title: 'Eficiência hídrica, NR-1 e saúde corporativa | TCAN',
      description:
        'Telemetria e redução do consumo de água, telemedicina e riscos psicossociais da NR-1, e nanotecnologia aplicada para empresas.',
    },
    solutions: [
      {
        id: 'hidrica',
        anchor: 'eficiencia-hidrica',
        name: 'Eficiência Hídrica',
        icon: 'droplets',
        summary:
          'Telemetria, tecnologias economizadoras e gestão contínua para dar visibilidade ao consumo de água e combater desperdícios na operação.',
        body: [
          'Água é custo, risco operacional e compromisso ESG. Com especialistas em eficiência hídrica, a TCAN começa pelo diagnóstico do consumo e instala sensores de telemetria ligados a um software personalizado, que acompanha o uso em tempo real e sinaliza desperdícios e vazamentos.',
          'Em seguida vêm peças economizadoras, detecção de vazamentos, revisão das contas e campanhas de conscientização. O acompanhamento é contínuo, com indicadores mensais, e há modelos sem investimento inicial. A mesma abordagem pode ser estendida à energia.',
        ],
        deliverables: [
          'Diagnóstico e auditoria de consumo',
          'Telemetria com sensores IoT e software personalizado',
          'Painel com indicadores mensais de consumo',
          'Peças e equipamentos economizadores',
          'Detecção e localização de vazamentos',
          'Campanhas de consumo consciente',
        ],
        formats: ['Programa contínuo', 'Remuneração fixa ou atrelada à economia gerada', 'Opção sem investimento inicial, mediante análise'],
        outcomes: [
          'Visibilidade do consumo em tempo real, por unidade',
          'Desperdícios e vazamentos identificados mais cedo',
          'Indicadores consistentes para relatórios ESG',
          'Equipes mais conscientes sobre o uso da água',
        ],
        keywords: ['eficiência hídrica para empresas', 'telemetria de consumo de água', 'redução do consumo de água', 'detecção de vazamentos', 'gestão de água ESG'],
        reviewStatus: draft,
      },
      {
        id: 'saude',
        anchor: 'saude-corporativa',
        name: 'Saúde Corporativa',
        icon: 'heart-pulse',
        summary:
          'Telemedicina, saúde mental e apoio à avaliação de riscos psicossociais da NR-1 para cuidar das pessoas e fortalecer a gestão de saúde.',
        body: [
          'Cuidar da saúde das equipes também é gestão de riscos. Por meio de especialistas em saúde digital, a TCAN oferece telemedicina com pronto atendimento online 24 horas e consultas com especialistas, inclusive para colaboradores em viagem ou no exterior.',
          'Para a NR-1, apoiamos a avaliação de riscos psicossociais com pesquisa e triagem por inteligência artificial de voz, seguidas de atendimento em psicologia e psiquiatria, capacitação de lideranças e conteúdos educativos. A frente se completa com consultoria em seguros e benefícios corporativos.',
        ],
        deliverables: [
          'Telemedicina e pronto atendimento online',
          'Avaliação de riscos psicossociais para a NR-1',
          'Triagem de saúde mental com IA de voz',
          'Atendimento em psicologia e psiquiatria',
          'Capacitação de lideranças em saúde mental',
          'Consultoria em seguros e benefícios',
        ],
        formats: ['Programa contínuo', 'Plataforma digital e aplicativo', 'Atendimento no Brasil e no exterior'],
        outcomes: [
          'Acesso facilitado ao cuidado médico e psicológico',
          'Mais clareza sobre os fatores de risco psicossocial da empresa',
          'Lideranças mais preparadas para lidar com saúde mental',
          'Base estruturada para o gerenciamento de riscos ocupacionais',
        ],
        keywords: ['telemedicina para empresas', 'NR-1 riscos psicossociais', 'saúde mental corporativa', 'programa de saúde corporativa', 'benefícios corporativos de saúde'],
        reviewStatus: draft,
      },
      {
        id: 'nano',
        anchor: 'nanotecnologia',
        name: 'Nanotecnologia',
        icon: 'atom',
        summary:
          'Soluções com nanopartículas metálicas, da pesquisa à escala industrial, para dar novas funções a produtos e materiais.',
        body: [
          'A nanotecnologia permite incorporar novas propriedades a materiais e produtos. Por meio de um ecossistema com laboratório e P&D dedicados, a TCAN conecta a sua empresa ao desenvolvimento de soluções com nanopartículas metálicas, como aditivos de ação antimicrobiana, adaptadas a cada aplicação.',
          'O trabalho passa por consultoria, caracterização, testes industriais e desenvolvimento sob medida, com formulações líquidas, em pó ou masterbatch, até o fornecimento em escala. Há apoio em propriedade intelectual, contratos e registros.',
        ],
        deliverables: [
          'Consultoria e avaliação de viabilidade',
          'Caracterização e testes industriais',
          'Desenvolvimento de solução sob medida',
          'Formulações líquidas, em pó e masterbatch',
          'Produção em escala com controle de qualidade',
          'Apoio em propriedade intelectual e registros',
        ],
        formats: ['Projeto de P&D sob medida', 'Adaptação de soluções já desenvolvidas', 'Fornecimento contínuo em escala'],
        outcomes: [
          'Produtos com novas funcionalidades e diferenciação técnica',
          'Caminho estruturado do laboratório ao mercado',
          'Decisões de inovação baseadas em testes e caracterização',
          'Inovação conectada à agenda ESG da empresa',
        ],
        keywords: ['nanotecnologia para empresas', 'nanopartículas de cobre', 'aditivo antimicrobiano', 'inovação industrial', 'desenvolvimento de nanotecnologia'],
        reviewStatus: draft,
      },
    ],
  },
  {
    id: 'pessoas',
    slug: 'pessoas-performance',
    name: 'Pessoas & Performance',
    icon: 'users',
    tagline: 'Pessoas preparadas, processos claros e execução consistente.',
    summary:
      'Diagnóstico executivo, educação corporativa e excelência operacional para alinhar lideranças, desenvolver equipes e dar consistência à execução, do escritório ao ponto de venda.',
    challenges: [
      'Sucessão e escolhas de liderança feitas sem avaliação estruturada',
      'Treinamentos isolados, sem conexão com a estratégia',
      'Execução desigual entre lojas, regiões e equipes de campo',
      'Equipes sob pressão, com engajamento baixo e foco disperso',
    ],
    faq: [
      {
        q: 'Os treinamentos podem ser personalizados?',
        a: 'Sim. Conteúdo, formato e duração são ajustados ao público, ao momento da empresa e aos objetivos do programa, de uma palestra pontual a um programa contínuo de desenvolvimento.',
      },
      {
        q: 'Vocês atuam presencialmente nas lojas e com as equipes de campo?',
        a: 'Sim. Conforme o escopo combinado, a execução no varejo pode incluir alinhamento presencial, acompanhamento de rotinas e treinamento no próprio ponto de venda.',
      },
      {
        q: 'Como acompanhamos a evolução depois da entrega?',
        a: 'Definimos com você os indicadores relevantes no início do projeto. Quando o escopo prevê acompanhamento, os resultados são revisados periodicamente.',
      },
    ],
    seo: {
      title: 'Educação corporativa e assessoria executiva | TCAN',
      description:
        'Assessment executivo, planejamento sucessório, palestras e treinamentos in company, team building e excelência operacional no varejo.',
    },
    solutions: [
      {
        id: 'diagnostico',
        anchor: 'diagnostico-assessoria-executiva',
        name: 'Diagnóstico & Assessoria Executiva',
        icon: 'scan-search',
        summary:
          'Avaliação de lideranças, planejamento sucessório e diagnóstico do negócio para apoiar as decisões críticas da alta gestão.',
        body: [
          'Decisões sobre pessoas-chave e sobre os rumos do negócio pedem método. A TCAN reúne especialistas para avaliar executivos de C-level e membros de conselho, combinando análise comportamental, contexto organizacional e competências de liderança em sucessões, promoções, preparação para conselhos e fusões e aquisições.',
          'O diagnóstico também olha para a empresa: estratégia, cultura, indicadores de negócio e saúde emocional das equipes. A partir dele, a assessoria executiva apoia a priorização, os planos de desenvolvimento individual e o acompanhamento da liderança.',
        ],
        deliverables: [
          'Avaliação executiva de C-level e conselhos',
          'Planejamento sucessório e mapeamento de sucessores',
          'Avaliação de lideranças em fusões e aquisições',
          'Diagnóstico estratégico e organizacional',
          'Planos de desenvolvimento individual',
          'Mentoria e acompanhamento executivo',
        ],
        formats: ['Diagnóstico pontual', 'Assessoria contínua à alta gestão', 'Mentoria individual'],
        outcomes: [
          'Decisões sobre lideranças apoiadas em critérios estruturados',
          'Sucessão planejada para posições críticas',
          'Visão integrada de negócio, cultura e pessoas',
          'Executivos com planos de desenvolvimento claros',
        ],
        keywords: ['assessment executivo', 'avaliação de executivos C-level', 'planejamento sucessório', 'consultoria para alta gestão', 'diagnóstico empresarial'],
        reviewStatus: draft,
      },
      {
        id: 'educacao',
        anchor: 'educacao-corporativa',
        name: 'Educação Corporativa',
        icon: 'graduation-cap',
        summary:
          'Palestras, workshops, treinamentos e team building sob medida para desenvolver lideranças, equipes comerciais e competências comportamentais.',
        body: [
          'Desenvolvimento só gera valor quando conversa com a estratégia. A TCAN monta programas de educação corporativa com especialistas em liderança, gestão, vendas, marca e comportamento, e adapta o conteúdo e o formato ao público e aos objetivos de cada empresa.',
          'Os temas incluem liderança, comunicação assertiva, resiliência, bem-estar, propósito e adaptabilidade, além de palestras que levam lições do esporte ao ambiente corporativo, como coragem, disciplina, autocontrole e perseverança. Os formatos podem ser presenciais, online ao vivo ou imersivos.',
        ],
        deliverables: [
          'Palestras para convenções e eventos',
          'Workshops e treinamentos in company',
          'Programas de desenvolvimento de lideranças',
          'Treinamentos comerciais e de vendas',
          'Dinâmicas de team building',
          'Mentorias individuais',
        ],
        formats: ['Palestra pontual ou programa contínuo', 'Presencial ou online ao vivo', 'Experiências imersivas e dinâmicas em grupo'],
        outcomes: [
          'Lideranças mais preparadas para desenvolver equipes',
          'Times mais alinhados aos valores e às metas da empresa',
          'Repertório comum para lidar com pressão e mudança',
          'Aprendizado conectado aos desafios reais do negócio',
        ],
        keywords: ['educação corporativa', 'treinamento de liderança', 'palestra motivacional para empresas', 'workshop in company', 'team building'],
        reviewStatus: draft,
      },
      {
        id: 'operacional',
        anchor: 'excelencia-operacional',
        name: 'Excelência Operacional',
        icon: 'settings-2',
        summary:
          'Processos, execução em campo e padrão de atendimento alinhados para que a estratégia aconteça de forma consistente em cada unidade.',
        body: [
          'Estratégia só gera resultado quando é bem executada. A TCAN atua com especialistas em execução no varejo para mapear e padronizar processos, promover o alinhamento presencial com as equipes de loja e de campo e elevar o padrão de atendimento ao cliente.',
          'Para sustentar essa rotina, o ecossistema entrega materiais de comunicação interna e de trade produzidos sob demanda, ações de live marketing, ferramentas digitais para acompanhar leads e vendas e times de tecnologia para automatizar etapas da operação.',
        ],
        deliverables: [
          'Mapeamento e padronização de processos',
          'Alinhamento e treinamento presencial de equipes',
          'Protocolos de excelência no atendimento',
          'Materiais de comunicação e de trade sob demanda',
          'Acompanhamento de leads e do funil de vendas',
          'Automação e tecnologia para a operação',
        ],
        formats: ['Programa contínuo', 'Atuação presencial no ponto de venda', 'Design e produção de materiais sob demanda'],
        outcomes: [
          'Execução mais consistente entre lojas e regiões',
          'Equipes alinhadas sobre processos e prioridades',
          'Experiência de atendimento mais uniforme',
          'Mais visibilidade sobre o que acontece na ponta',
        ],
        keywords: ['excelência operacional', 'execução no ponto de venda', 'padronização de processos', 'treinamento de equipes de loja', 'excelência no atendimento'],
        reviewStatus: draft,
      },
    ],
  },
];

export const pillarBySlug = (slug: string) => pillars.find((p) => p.slug === slug);
export const pillarById = (id: Pillar['id']) => pillars.find((p) => p.id === id)!;
export const solutionCount = pillars.reduce((n, p) => n + p.solutions.length, 0);
