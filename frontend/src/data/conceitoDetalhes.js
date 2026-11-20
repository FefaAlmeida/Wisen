import { conceitos } from "./conceitos";

const detalhes = {
  Inflação: {
    explicacao: [
      "Quando os preços sobem de forma ampla e persistente, a moeda perde poder de compra: a mesma quantia passa a comprar menos. O aumento isolado de um produto, por si só, não significa que toda a economia está passando por inflação.",
      "Esse movimento pode estar ligado à demanda, aos custos de produção e às expectativas sobre os preços. No Brasil, índices como o IPCA acompanham a variação de uma cesta de bens e serviços consumidos pelas famílias.",
    ],
    exemplo:
      "Imagine uma cesta de compras que custava R$ 100 e passa a custar R$ 105. A alta dessa cesta foi de 5%. Se sua renda permanece igual, sobra menos dinheiro para outras despesas. É um exemplo ilustrativo, não uma taxa de inflação observada.",
    importancia:
      "Ajuda a entender notícias sobre o custo de vida, reajustes de salário e decisões sobre a taxa de juros.",
  },
  "Taxa Selic": {
    explicacao: [
      "A Selic é a taxa básica de juros do Brasil. Ela serve de referência para outras taxas da economia, afetando o custo dos empréstimos e o rendimento de aplicações financeiras.",
      "Juros mais altos tendem a conter o consumo e o crédito, ajudando a reduzir pressões sobre os preços. Seus efeitos não são imediatos e dependem de outras condições da economia.",
    ],
    exemplo:
      "Se o crédito fica mais caro, uma família pode adiar uma compra parcelada. Esse tipo de decisão, repetido na economia, pode reduzir a pressão da demanda sobre os preços.",
    importancia:
      "Ajuda a conectar decisões de juros a notícias sobre inflação, investimentos e consumo.",
  },
  "Política monetária": {
    explicacao: [
      "É a atuação do Banco Central sobre os juros e as condições de liquidez da economia. Um de seus objetivos é manter a inflação sob controle.",
      "Uma política mais restritiva encarece o crédito e tende a desacelerar a demanda. Uma política mais expansionista pode estimular crédito e atividade, conforme as condições econômicas.",
    ],
    exemplo:
      "Ao elevar a taxa básica de juros, o Banco Central influencia o custo dos financiamentos. Empresas e consumidores podem rever seus planos de investimento e de compra.",
    importancia:
      "Dá contexto às notícias sobre decisões do Banco Central e seus efeitos na economia.",
  },
  "Gases de efeito estufa": {
    explicacao: [
      "Esses gases absorvem parte da radiação infravermelha emitida pela Terra e ajudam a manter o planeta aquecido. O efeito estufa natural é essencial à vida.",
      "O aumento de sua concentração por atividades humanas, como a queima de combustíveis fósseis, intensifica esse efeito e contribui para o aquecimento global.",
    ],
    exemplo:
      "Ao queimar gasolina, um veículo libera dióxido de carbono. O acúmulo desse gás na atmosfera contribui para alterar o balanço de energia do planeta.",
    importancia:
      "Ajuda a entender metas de redução de emissões e debates sobre energia, transporte e clima.",
  },
  "Aquecimento global": {
    explicacao: [
      "É o aumento da temperatura média do planeta ao longo do tempo. O aquecimento atual está ligado principalmente ao aumento de gases de efeito estufa causado por atividades humanas.",
      "A média global não descreve o tempo em cada lugar: ainda podem ocorrer dias frios. A tendência de longo prazo afeta oceanos, geleiras e padrões climáticos.",
    ],
    exemplo:
      "Uma semana fria em uma cidade pode ocorrer mesmo quando a temperatura média global aumenta. Tempo local e tendência climática são escalas diferentes.",
    importancia:
      "Ajuda a interpretar notícias sobre ondas de calor, derretimento de geleiras e mudanças nos ecossistemas.",
  },
  "Aprendizado de máquina": {
    explicacao: [
      "Em vez de receber uma regra para cada situação, um sistema identifica padrões em exemplos e os utiliza para produzir previsões ou classificações.",
      "O resultado depende dos dados de treinamento e de como o modelo é avaliado. Reconhecer padrões não garante que a resposta esteja correta em situações novas.",
    ],
    exemplo:
      "Um filtro de spam aprende com mensagens identificadas como desejadas ou indesejadas e usa os padrões encontrados para classificar novas mensagens.",
    importancia:
      "Ajuda a avaliar o que sistemas de IA conseguem fazer e por que podem cometer erros.",
  },
  "Regulação de IA": {
    explicacao: [
      "Reúne regras e mecanismos de supervisão para o desenvolvimento e uso da inteligência artificial. Pode envolver proteção de dados, transparência, avaliação de riscos e responsabilidade por danos.",
      "As exigências variam conforme o local e a aplicação. Um sistema usado em uma decisão de alto impacto pode exigir cuidados diferentes de uma ferramenta recreativa.",
    ],
    exemplo:
      "Ao avaliar uma IA usada na seleção de candidatos, pode ser necessário verificar se seus critérios produzem discriminação e se existe uma forma de contestar a decisão.",
    importancia:
      "Ajuda a acompanhar debates sobre direitos, responsabilidade e segurança no uso da IA.",
  },
  "Comércio internacional": {
    explicacao: [
      "Envolve a compra e venda de bens e serviços entre países. As trocas dependem de fatores como custos de produção, câmbio, transporte e acordos comerciais.",
      "Tarifas e outras barreiras podem alterar os preços e a competitividade dos produtos. Seus efeitos variam entre consumidores, empresas e setores.",
    ],
    exemplo:
      "Uma empresa que importa componentes pode enfrentar custos maiores quando a moeda estrangeira se valoriza. Isso pode influenciar o preço do produto final.",
    importancia: "Ajuda a entender notícias sobre tarifas, exportações e cadeias de produção.",
  },
  "Mudanças climáticas": {
    explicacao: [
      "São alterações duradouras nos padrões do clima, como temperatura e precipitação. O aquecimento global é uma parte desse processo.",
      "As mudanças atuais afetam a frequência e a intensidade de alguns eventos extremos e alteram ecossistemas. Seus efeitos variam entre regiões.",
    ],
    exemplo:
      "Uma mudança persistente no regime de chuvas pode exigir adaptações na agricultura e no abastecimento de água de uma região.",
    importancia:
      "Ajuda a relacionar notícias sobre clima a impactos ambientais, sociais e econômicos.",
  },
  "Nível do mar": {
    explicacao: [
      "É a altura da superfície dos oceanos em relação a uma referência. Seu aumento está ligado, entre outros fatores, à expansão da água aquecida e à perda de gelo em terra.",
      "A variação não é igual em todas as regiões. Correntes oceânicas e movimentos do terreno também influenciam o nível relativo observado em uma costa.",
    ],
    exemplo:
      "Quando uma geleira em terra perde gelo para o oceano, acrescenta água ao mar. Isso é diferente do derretimento de gelo que já flutua na água.",
    importancia:
      "Ajuda a compreender riscos de inundação costeira e planejamento de cidades litorâneas.",
  },
  "Calotas polares": {
    explicacao: [
      "São grandes massas de gelo nas regiões polares. O gelo sobre os continentes armazena água que pode chegar aos oceanos quando derrete.",
      "Superfícies de gelo também refletem parte da luz solar. Sua redução pode fazer com que superfícies mais escuras absorvam mais energia.",
    ],
    exemplo:
      "O gelo sobre a Groenlândia está em terra. Sua perda pode acrescentar água aos oceanos e contribuir para a elevação do nível do mar.",
    importancia:
      "Ajuda a interpretar notícias sobre perda de gelo, aquecimento e nível dos oceanos.",
  },
};

const extras = [
  {
    titulo: "Mudanças climáticas",
    descricao:
      "Alterações duradouras nos padrões de temperatura, chuvas e outras características do clima.",
    status: "Em revisão",
    progresso: 50,
  },
  {
    titulo: "Nível do mar",
    descricao:
      "Altura da superfície dos oceanos em relação a uma referência, influenciada pelo clima e por fatores locais.",
    status: "Em revisão",
    progresso: 40,
  },
  {
    titulo: "Calotas polares",
    descricao:
      "Grandes massas de gelo das regiões polares que participam do equilíbrio climático do planeta.",
    status: "Lacuna",
    progresso: 20,
  },
].map((concept) => ({ ...concept, categoria: "Meio ambiente" }));

export const conceitosDetalhados = [...conceitos, ...extras].map((concept) => ({
  ...concept,
  ...detalhes[concept.titulo],
}));

export const demoConceptHref = (name) => `/paginaConceito?conceito=${encodeURIComponent(name)}`;
