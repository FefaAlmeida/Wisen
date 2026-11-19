import { FileText, Globe, TrendingUp, UserPlus, Users } from "lucide-react";

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
          variacao: "+12%",
          periodo: "nos últimos 30 dias",
          icone: Users,
        },
        {
          titulo: "Novos usuários",
          valor: "236",
          variacao: "+18%",
          periodo: "neste mês",
          icone: UserPlus,
        },
        {
          titulo: "Conteúdos publicados",
          valor: "482",
          variacao: "+8%",
          periodo: "no total",
          icone: FileText,
        },
        {
          titulo: "Eventos monitorados",
          valor: "127",
          variacao: "+24%",
          periodo: "neste mês",
          icone: Globe,
        },
        {
          titulo: "Engajamento geral",
          valor: "72%",
          variacao: "+5%",
          periodo: "de usuários ativos",
          icone: TrendingUp,
        },
      ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricas.map((item) => {
        const Icone = item.icone;
        return (
          <div
            key={item.titulo}
            className="rounded-lg border border-[#EBDD80] bg-[#FBF7E5] p-4 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-semibold text-[#526584]">{item.titulo}</span>
              <div className="rounded-lg bg-[#2B333F] p-2 text-[#EBDD80]">
                <Icone className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-wisen-titulo">{item.valor}</span>
              {item.variacao && (
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  {item.variacao}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[#7182A1]">{item.periodo}</p>
          </div>
        );
      })}
    </div>
  );
}
