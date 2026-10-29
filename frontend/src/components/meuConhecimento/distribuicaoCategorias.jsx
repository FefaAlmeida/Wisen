"use client";

import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DistribuicaoCategorias() {
  const categorias = [
    { nome: "Economia", percentagem: "32%", qtd: "41 de 128", corBg: "bg-[#E8E191]" },
    { nome: "Política", percentagem: "24%", qtd: "31 de 128", corBg: "bg-[#2B333F]" },
    { nome: "Meio ambiente", percentagem: "18%", qtd: "23 de 128", corBg: "bg-emerald-400" },
    { nome: "Tecnologia", percentagem: "15%", qtd: "19 de 128", corBg: "bg-sky-400" },
    { nome: "Sociedade", percentagem: "11%", qtd: "14 de 128", corBg: "bg-indigo-300" },
  ];

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8E191]" />
          <CardTitle className="text-base font-bold text-[#2B333F] flex items-center gap-1.5">
            Distribuição por categoria
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-2 space-y-6">
        {/* Gráfico de Anel e Contador Central */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <svg aria-hidden="true" viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {/* Economia: 32% (Amarelo) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#E8E191"
              strokeWidth="3.8"
              strokeDasharray="32 68"
              strokeDashoffset="0"
            />
            {/* Política: 24% (Azul Escuro) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#2B333F"
              strokeWidth="3.8"
              strokeDasharray="24 76"
              strokeDashoffset="-32"
            />
            {/* Meio Ambiente: 18% (Verde) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#34D399"
              strokeWidth="3.8"
              strokeDasharray="18 82"
              strokeDashoffset="-56"
            />
            {/* Tecnologia: 15% (Azul) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#38BDF8"
              strokeWidth="3.8"
              strokeDasharray="15 85"
              strokeDashoffset="-74"
            />
            {/* Sociedade: 11% (Roxo/Anil) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#A5B4FC"
              strokeWidth="3.8"
              strokeDasharray="11 89"
              strokeDashoffset="-89"
            />
          </svg>

          {/* Texto Centralizado */}
          <div className="absolute text-center">
            <span className="text-2xl font-extrabold text-[#2B333F] block leading-none">128</span>
            <span className="text-[10px] font-medium text-slate-400 mt-1 block">
              conceitos
              <br />
              dominados
            </span>
          </div>
        </div>

        {/* Legenda dos Temas */}
        <div className="space-y-2.5 pt-1">
          {categorias.map((cat) => (
            <div key={cat.nome} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.corBg}`} />
                <span className="font-semibold text-[#2B333F] truncate">{cat.nome}</span>
                <span className="text-[11px] text-slate-400 font-normal">({cat.qtd})</span>
              </div>
              <span className="font-bold text-[#2B333F] shrink-0 ml-2">{cat.percentagem}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
