import { Cloud, FileText, Laptop, Wallet } from "lucide-react";
import React from "react";

export function CartoesMetricasIa() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Cartão 1: Orçamento Mensal */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-[#2B333F]">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Orçamento mensal</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-[#2B333F]">R$ 68,40</span>
              <span className="text-xs text-slate-400 font-medium ml-1.5">de R$ 100,00</span>
            </div>
            <span className="text-xs font-bold text-[#2B333F]">68%</span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E8E191] h-full rounded-full transition-all duration-300"
              style={{ width: "68%" }}
            />
          </div>
        </div>

        <p className="text-[10px] font-medium text-slate-400">
          R$ 31,60 restantes até o limite mensal
        </p>
      </div>

      {/* Cartão 2: Requisições Totais */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-[#2B333F]">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Requisições totais</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#2B333F]">1.248</span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              +12%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">em relação ao mês anterior</p>
        </div>

        {/* Sparkline SVG */}
        <div className="h-6 w-full pt-1">
          <svg
            aria-hidden="true"
            className="w-full h-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path d="M 0 15 Q 25 18, 50 10 T 100 5" fill="none" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Cartão 3: Processamentos Locais */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-[#2B333F]">
            <Laptop className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Processamentos locais</span>
        </div>

        <div className="space-y-1">
          <span className="text-2xl font-black text-[#2B333F]">892</span>
          <p className="text-[10px] text-slate-400">
            <strong className="text-slate-600">72%</strong> do total
          </p>
        </div>

        {/* Sparkline SVG Azul */}
        <div className="h-6 w-full pt-1">
          <svg
            aria-hidden="true"
            className="w-full h-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 16 Q 20 12, 40 14 T 80 6 T 100 8"
              fill="none"
              stroke="#2B333F"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Cartão 4: Chamadas a APIs Externas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-[#2B333F]">
            <Cloud className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Chamadas a APIs externas</span>
        </div>

        <div className="space-y-1">
          <span className="text-2xl font-black text-[#2B333F]">356</span>
          <p className="text-[10px] text-slate-400">
            <strong className="text-slate-600">28%</strong> do total
          </p>
        </div>

        {/* Sparkline SVG Amarelo */}
        <div className="h-6 w-full pt-1">
          <svg
            aria-hidden="true"
            className="w-full h-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path d="M 0 18 Q 30 15, 60 8 T 100 3" fill="none" stroke="#E8E191" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
