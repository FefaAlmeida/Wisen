import { ArrowUp, FileText, Globe, TrendingUp, UserPlus, Users } from "lucide-react";

export function CartoesMetricasAdm({ counts } = {}) {
  const metricas = counts
    ? [
        {
          titulo: "Usuários cadastrados",
          valor: Number(counts.users).toLocaleString("pt-BR"),
          periodo: "no total",
          icone: Users,
        },
        {
          titulo: "Artigos coletados",
          valor: Number(counts.articles).toLocaleString("pt-BR"),
          periodo: "no total",
          icone: FileText,
        },
        {
          titulo: "Eventos monitorados",
          valor: Number(counts.events).toLocaleString("pt-BR"),
          periodo: "ativos",
          icone: Globe,
        },
        {
          titulo: "Conceitos",
          valor: Number(counts.concepts).toLocaleString("pt-BR"),
          periodo: "na biblioteca",
          icone: TrendingUp,
        },
        {
          titulo: "Pendências de IA",
          valor: Number(counts.errors).toLocaleString("pt-BR"),
          periodo: "tarefas falhas ou pausadas",
          icone: FileText,
        },
      ]
    : [
        {
          titulo: "Usuários ativos",
          valor: "1.248",
          variacao: "12%",
          periodo: "Últimos 30 dias vs. período anterior",
          icone: Users,
        },
        {
          titulo: "Novos usuários",
          valor: "236",
          variacao: "18%",
          periodo: "Mês atual vs. anterior",
          icone: UserPlus,
        },
        {
          titulo: "Conteúdos publicados",
          valor: "482",
          variacao: "8%",
          descricao: "no total",
          periodo: "Vs. acumulado até o mês anterior",
          icone: FileText,
        },
        {
          titulo: "Eventos monitorados",
          valor: "127",
          variacao: "24%",
          periodo: "Mês atual vs. anterior",
          icone: Globe,
        },
        {
          titulo: "Engajamento geral",
          valor: "72%",
          variacao: "5%",
          descricao: "dos usuários ativos",
          periodo: "Vs. mês anterior",
          icone: TrendingUp,
        },
      ];

  return (
    <section aria-label="Indicadores da visão geral" className="@container min-w-0">
      <ul className="grid grid-cols-1 gap-3 @min-[24rem]:grid-cols-2 @min-[36rem]:grid-cols-6 @min-[60rem]:grid-cols-5">
        {metricas.map(({ titulo, valor, descricao, variacao, periodo, icone: Icone }) => (
          <li
            key={titulo}
            className="row-span-3 grid min-w-0 grid-rows-subgrid gap-y-3 rounded-2xl border border-wisen-borda bg-white px-4 py-4 shadow-xs @min-[24rem]:last:col-span-2 @min-[36rem]:col-span-2 @min-[36rem]:nth-last-[-n+2]:col-span-3 @min-[60rem]:nth-[n]:col-span-1 @min-[70rem]:px-5"
          >
            <h2 className="flex items-center gap-2.5 text-sm/5 font-medium text-wisen-texto-forte">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#FBF5D9] text-[#795C0F]">
                <Icone aria-hidden="true" className="size-4" />
              </span>
              <span className="min-w-0 wrap-break-word">{titulo}</span>
            </h2>

            <p>
              <strong className="block wrap-anywhere text-[2rem]/none font-semibold tracking-tight text-wisen-titulo tabular-nums @min-[60rem]:text-4xl/none">
                {valor}
              </strong>
              {descricao && (
                <span className="mt-1 block text-xs/4 text-wisen-texto-suave">{descricao}</span>
              )}
            </p>

            <p className="text-xs/4 text-wisen-texto-suave">
              {variacao && (
                <span className="mb-0.5 flex items-center gap-1 font-semibold text-emerald-700 tabular-nums">
                  <ArrowUp aria-hidden="true" className="size-3" />
                  <span className="sr-only">Aumento de </span>
                  {variacao}
                </span>
              )}
              {periodo}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
