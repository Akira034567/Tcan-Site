/** Site-wide copy blocks (draft until the founders approve). */
import type { IconName } from '../lib/icons.ts';

export const proof = [
  { value: '35', unit: 'anos', label: 'de mercado de cada sócio, em grandes empresas' },
  { value: '4', unit: 'frentes', label: 'de atuação integradas em um só ecossistema' },
  { value: '12', unit: 'soluções', label: 'para marca, inovação, ESG e pessoas' },
  { value: '1', unit: 'ponto de contato', label: 'do diagnóstico à entrega, com os sócios' },
];

export const journey: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'Desafios',
    text: 'Entendemos o contexto, os números e as pessoas por trás do problema antes de propor qualquer caminho.',
    icon: 'target',
  },
  {
    title: 'Oportunidades',
    text: 'Transformamos o diagnóstico em prioridades claras e conectamos as soluções e os especialistas certos.',
    icon: 'trending-up',
  },
  {
    title: 'Impacto',
    text: 'Acompanhamos a execução com indicadores até a meta ser ticada, e seguimos melhorando.',
    icon: 'circle-check-big',
  },
];

export const method: { step: string; title: string; text: string; icon: IconName }[] = [
  {
    step: '01',
    title: 'Diagnóstico',
    text: 'Escuta da liderança, leitura de dados e visita à operação para entender onde está o valor.',
    icon: 'scan-search',
  },
  {
    step: '02',
    title: 'Estratégia',
    text: 'Prioridades, metas e indicadores definidos com você, com escopo, prazos e responsáveis.',
    icon: 'route',
  },
  {
    step: '03',
    title: 'Conexão',
    text: 'Montamos o time ideal com especialistas do ecossistema, sob a coordenação da TCAN.',
    icon: 'network',
  },
  {
    step: '04',
    title: 'Execução & medição',
    text: 'Mão na massa no ciclo Construir-Medir-Aprender, com acompanhamento e ajustes contínuos.',
    icon: 'repeat',
  },
];

export const cycle = [
  { title: 'Construir', text: 'Colocamos a estratégia em prática, junto com o seu time.', icon: 'hammer' as IconName },
  { title: 'Medir', text: 'Acompanhamos indicadores para saber o que está funcionando.', icon: 'gauge' as IconName },
  { title: 'Aprender', text: 'Ajustamos a rota e transformamos aprendizado em resultado.', icon: 'brain' as IconName },
];

export const differentiators: { title: string; text: string; icon: IconName }[] = [
  {
    title: 'Olhar de dono',
    text: 'Sentamos na cadeira executiva e assumimos a missão do seu negócio como se fosse nossa.',
    icon: 'badge-check',
  },
  {
    title: 'Um único interlocutor',
    text: 'Você conversa com os sócios. A TCAN coordena especialistas, prazos e qualidade de ponta a ponta.',
    icon: 'messages-square',
  },
  {
    title: 'Ecossistema curado',
    text: 'Especialistas selecionados para cada desafio, sem estruturas inchadas nem custo fixo desnecessário.',
    icon: 'network',
  },
  {
    title: 'Experiência executiva',
    text: 'Sócios com formação na FGV, FAAP e IESE e trajetória em grandes empresas de serviços.',
    icon: 'briefcase',
  },
];

export const generalFaq = [
  {
    q: 'O que faz uma assessoria de negócios como a TCAN?',
    a: 'A TCAN atua como estrategista e hub de conexões: entende o desafio, desenha a estratégia, conecta os especialistas certos do nosso ecossistema e acompanha a execução com olhar de dono até a meta ser atingida.',
  },
  {
    q: 'Com que tipo de empresa vocês trabalham?',
    a: 'Com empresas de diferentes portes e setores, como telecomunicações, varejo, serviços financeiros, saúde, energia, alimentação e tecnologia, que buscam acelerar resultados com estratégia e boa execução.',
  },
  {
    q: 'Como funciona o hub de especialistas?',
    a: 'Selecionamos especialistas para cada frente e coordenamos todo o trabalho. Você tem um único ponto de contato, com escopo, prazos e indicadores definidos pela TCAN desde o início.',
  },
  {
    q: 'Posso contratar apenas uma solução?',
    a: 'Sim. Cada solução pode ser contratada de forma independente. Quando faz sentido, integramos frentes para que marca, operação e pessoas avancem na mesma direção.',
  },
  {
    q: 'Como começa um projeto?',
    a: 'Com uma conversa com um dos sócios. Depois vêm o diagnóstico e uma proposta com escopo, cronograma e indicadores. Só então partimos para a execução e o acompanhamento.',
  },
  {
    q: 'Quanto custa um projeto?',
    a: 'Cada projeto é orçado sob medida, a partir do diagnóstico e do escopo combinado. Em algumas frentes há modelos de remuneração diferentes, que apresentamos com transparência na proposta.',
  },
];
