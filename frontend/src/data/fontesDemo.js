export const fontesIniciais = [
  {
    id: 1,
    nome: "G1",
    url: "https://g1.globo.com/rss/g1/",
    ativo: true,
    ultimaColeta: "01/10/2026 09:42",
    frequencia: "A cada 15 min",
  },
  {
    id: 2,
    nome: "Valor Econômico",
    url: "https://valor.globo.com/rss/",
    ativo: true,
    ultimaColeta: "01/10/2026 09:35",
    frequencia: "1 hora",
  },
  {
    id: 3,
    nome: "Agência Brasil",
    url: "https://agenciabrasil.ebc.com.br/rss",
    ativo: false,
    ultimaColeta: "30/09/2026 18:20",
    frequencia: "6 horas",
  },
  {
    id: 4,
    nome: "Meio Ambiente News",
    url: "https://meioambientenews.com.br/rss",
    ativo: true,
    ultimaColeta: "01/10/2026 08:17",
    frequencia: "1 hora",
  },
  {
    id: 5,
    nome: "Portal Tecnologia",
    url: "https://tecnologia.uol.com.br/rss",
    ativo: true,
    ultimaColeta: "01/10/2026 09:28",
    frequencia: "A cada 15 min",
  },
];

export const logsIniciais = [
  {
    id: 1,
    data: "01/10/2026 08:12",
    fonte: "Agência Brasil",
    erro: "Timeout na conexão com o feed RSS (30s)",
    status: "Falha",
  },
  {
    id: 2,
    data: "30/09/2026 22:41",
    fonte: "Portal Tecnologia",
    erro: "Feed indisponível (HTTP 503)",
    status: "Falha",
  },
  {
    id: 3,
    data: "30/09/2026 14:18",
    fonte: "Meio Ambiente News",
    erro: "XML inválido no feed",
    status: "Falha",
  },
  {
    id: 4,
    data: "29/09/2026 19:07",
    fonte: "Valor Econômico",
    erro: "Link quebrado em item do feed",
    status: "Aviso",
  },
];
