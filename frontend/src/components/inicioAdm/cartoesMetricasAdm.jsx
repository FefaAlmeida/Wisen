import React from 'react';
import { Users, UserPlus, FileText, Globe, TrendingUp } from "lucide-react";

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
      {metricas.map((item, idx) => {
        const Icone = item.icone;
        return (
          <div 
            key={idx}
            className={`p-4 rounded-2xl border transition-all ${
              item.destaque 
                ? 'bg-[#E8E191]/30 border-[#E8E191] shadow-xs' 
                : 'bg-white border-slate-200/80 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold text-slate-500">{item.titulo}</span>
              <div className={`p-2 rounded-xl ${item.destaque ? 'bg-[#2B333F] text-[#E8E191]' : 'bg-slate-100 text-[#2B333F]'}`}>
                <Icone className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2B333F]">{item.valor}</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {item.variacao}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 mt-1">{item.periodo}</p>
          </div>
        );
      })}
    </div>
  );
}