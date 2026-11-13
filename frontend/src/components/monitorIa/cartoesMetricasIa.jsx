import { Cloud, FileText, Laptop, Wallet } from "lucide-react";

export function CartoesMetricasIa() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Cartão 1: Orçamento Mensal */}
      <div className="flex flex-col justify-between space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-slate-100 p-2 text-[#2B333F]">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-600">Orçamento mensal</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-[#2B333F]">R$ 68,40</span>
              <span className="ml-1.5 text-sm font-medium text-slate-500">de R$ 100,00</span>
            </div>
            <span className="text-sm font-semibold text-[#2B333F]">68%</span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#EBDD80] transition-all duration-300"
              style={{ width: "68%" }}
            />
          </div>
        </div>

        <p className="text-xs font-medium text-slate-500">R$ 31,60 restantes até o limite mensal</p>
      </div>

      {/* Cartão 2: Requisições Totais */}
      <div className="flex flex-col justify-between space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-slate-100 p-2 text-[#2B333F]">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-600">Requisições totais</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#2B333F]">1.248</span>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
              +12%
            </span>
          </div>
          <p className="text-xs text-slate-500">em relação ao mês anterior</p>
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
      <div className="flex flex-col justify-between space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-slate-100 p-2 text-[#2B333F]">
            <Laptop className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-600">Processamentos locais</span>
        </div>

        <div className="space-y-1">
          <span className="text-3xl font-bold text-[#2B333F]">892</span>
          <p className="text-xs text-slate-500">
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
      <div className="flex flex-col justify-between space-y-3 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-slate-100 p-2 text-[#2B333F]">
            <Cloud className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-600">Chamadas a APIs externas</span>
        </div>

        <div className="space-y-1">
          <span className="text-3xl font-bold text-[#2B333F]">356</span>
          <p className="text-xs text-slate-500">
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
            <path d="M 0 18 Q 30 15, 60 8 T 100 3" fill="none" stroke="#EBDD80" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
