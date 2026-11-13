export const demoConcepts = [
  {
    name: "Inflação",
    description:
      "Inflação é o aumento generalizado dos preços ao longo do tempo. Quando os preços sobem, a mesma quantia compra menos produtos e serviços.",
    topic: "Inflação",
  },
  {
    name: "Taxa Selic",
    description:
      "A Selic é a taxa básica de juros da economia brasileira. Ela influencia o custo do crédito, a remuneração de aplicações e o ritmo do consumo.",
    topic: "Juros",
  },
  {
    name: "Câmbio",
    description:
      "Câmbio é o preço de uma moeda em relação a outra. Suas variações afetam importações, exportações e custos de produtos com componentes estrangeiros.",
    topic: "Comércio",
  },
  {
    name: "Produto Interno Bruto",
    description:
      "O PIB mede o valor dos bens e serviços finais produzidos em um território durante um período. Seu crescimento ajuda a acompanhar a atividade econômica.",
    topic: "Economia",
  },
  {
    name: "Política fiscal",
    description:
      "Política fiscal reúne decisões do governo sobre arrecadação e gastos públicos. Essas escolhas influenciam os serviços públicos, a atividade econômica e o endividamento.",
    topic: "Contas públicas",
  },
  {
    name: "Oferta e demanda",
    description:
      "Oferta é a quantidade que produtores desejam vender, e demanda é a quantidade que consumidores desejam comprar. A interação entre elas influencia preços e quantidades negociadas.",
    topic: "Renda e consumo",
  },
];

export function mockQuestions(context) {
  const name = context.name ?? "o conceito";
  const description =
    context.description || `O significado de ${name} depende do contexto apresentado.`;
  return {
    questions: [
      {
        prompt: `[Demonstração] Qual alternativa descreve ${name}?`,
        options: [
          description,
          "É uma medida que impede qualquer variação de preços.",
          "É uma garantia de retorno financeiro para todos os investimentos.",
          "É um indicador sem relação com a economia.",
        ],
        correct_index: 0,
        explanation: description,
        rubric: description,
      },
      {
        prompt: `[Demonstração] Como estudar ${name} em uma notícia?`,
        options: [
          "Comparando o contexto, o período e as fontes dos dados.",
          "Usando apenas o título, sem ler o conteúdo.",
          "Tratando qualquer previsão como certeza.",
          "Ignorando o período dos indicadores.",
        ],
        correct_index: 0,
        explanation:
          "O contexto, o período e as fontes ajudam a interpretar um indicador sem tirar conclusões além das evidências.",
        rubric: "Mencionar contexto, período e fontes dos dados.",
      },
    ],
  };
}

export function generateMock(input, operation = input.operation) {
  const context = input.context ?? {};
  let data;
  if (operation === "questions") data = mockQuestions(context);
  else if (operation === "grade") {
    // A preview must never pretend to assess a student's understanding.
    data = {
      verdict: "partial",
      feedback: `Demonstração: sua resposta foi registrada, mas não foi avaliada por IA. Resposta de referência: ${context.expected ?? context.rubric ?? "Consulte a explicação do conceito."}`,
    };
  } else if (operation === "analysis") {
    const article = context.article ?? {};
    const text = `${article.title ?? ""} ${article.content ?? ""}`.toLocaleLowerCase("pt-BR");
    const concepts = demoConcepts.filter((c) => text.includes(c.name.toLocaleLowerCase("pt-BR")));
    data = {
      title: article.title || "Conteúdo de demonstração",
      summary: `[Análise simulada] ${(article.content ?? article.title ?? "Sem conteúdo disponível.").slice(0, 1200)}`,
      event_id: null,
      topics: concepts.map((c) => c.topic),
      concepts: concepts.map(({ name, description }) => ({
        name,
        description,
        alias_of:
          context.knownConcepts?.find((c) => c.name.toLowerCase() === name.toLowerCase())?.id ??
          null,
        aliases: [],
      })),
      entities: [],
      relations: [],
    };
  } else {
    const concepts = context.concepts ?? context.event?.concepts ?? (context.name ? [context] : []);
    const title = context.name ?? context.title ?? "este conteúdo";
    const content =
      context.description ??
      context.summary ??
      context.content ??
      "Explore os conceitos relacionados para entender o contexto econômico.";
    const detail = input.passage
      ? `Trecho selecionado: “${input.passage}”\n\nO trecho faz parte de ${title}. Compare-o com o restante do texto e com os conceitos relacionados.`
      : `${title}\n\n${content}`;
    const extra =
      operation === "deepen"
        ? "\n\nExemplo ilustrativo: se uma cesta custava R$ 100 e passa a custar R$ 110, seu custo subiu 10%. Compare sempre o mesmo conjunto de produtos e o mesmo período."
        : "";
    data = {
      text: `Modo de demonstração — explicação simulada, sem uso de IA.\n\n${detail}${extra}\n\n${concepts.map((c) => `${c.name}: ${c.description ?? "Consulte a página do conceito para saber mais."}`).join("\n\n")}`.slice(
        0,
        19000,
      ),
      concepts: concepts.map((c) => c.name),
    };
  }
  return { data, usage: { input_tokens: 0, output_tokens: 0 } };
}
