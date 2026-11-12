import { FileText, Globe, TrendingUp, UserPlus, Users } from "lucide-react";

export function CartoesMetricasAdm() {
  const metricas = [
    {
      titulo: "Usuários ativos",
      valor: "1.248",
      variacao: "+12%",
      periodo: "nos últimos 30 dias",
      icone: Users,
      destaque: false,
    },
    {
      titulo: "Novos usuários",
      valor: "236",
      variacao: "+18%",
      periodo: "neste mês",
      icone: UserPlus,
      destaque: false,
    },
    {
      titulo: "Conteúdos publicados",
      valor: "482",
      variacao: "+8%",
      periodo: "no total",
      icone: FileText,
      destaque: false,
    },
    {
      titulo: "Eventos monitorados",
      valor: "127",
      variacao: "+24%",
      periodo: "neste mês",
      icone: Globe,
      destaque: false,
    },
    {
      titulo: "Engajamento geral",
      valor: "72%",
      variacao: "+5%",
      periodo: "de usuários ativos",
      icone: TrendingUp,
      destaque: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metricas.map((item) => {
        const Icone = item.icone;
        return (
          <div
            key={item.titulo}
            className={`rounded-lg border p-4 transition-all hover:shadow-md ${
              item.destaque
                ? "border-[#EBDD80] bg-[#EBDD80]/30 shadow-xs"
                : "bg-white border-slate-200/80 shadow-2xs"
            }`}
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm font-semibold text-slate-600">{item.titulo}</span>
              <div
                className={`rounded-lg p-2 ${item.destaque ? "bg-[#2B333F] text-[#EBDD80]" : "bg-slate-100 text-[#2B333F]"}`}
              >
                <Icone className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[#2B333F]">{item.valor}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                {item.variacao}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">{item.periodo}</p>
          </div>
        );
      })}
    </div>
  );
}
