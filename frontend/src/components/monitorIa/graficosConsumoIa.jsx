import React from "react";

export function GraficosConsumoIa() {
  const modelos = [
    { nome: "GPT-4o", valor: "R$ 32,10", pct: "46,9%", cor: "bg-[#2B333F]" },
    { nome: "Claude 3.5", valor: "R$ 18,75", pct: "27,4%", cor: "bg-[#E8E191]" },
    { nome: "Gemini 1.5", valor: "R$ 11,30", pct: "16,5%", cor: "bg-slate-500" },
    { nome: "Outros", valor: "R$ 6,25", pct: "9,1%", cor: "bg-slate-300" },
  ];

  // Dados mock para as barras empilhadas (31 dias simplificados em colunas)
  const barras = [
    { dia: "1 out", local: 40, externa: 20 },
    { dia: "", local: 50, externa: 35 },
    { dia: "", local: 45, externa: 25 },
    { dia: "", local: 35, externa: 15 },
    { dia: "5 out", local: 60, externa: 40 },
    { dia: "", local: 55, externa: 30 },
    { dia: "", local: 40, externa: 20 },
    { dia: "", local: 70, externa: 50 },
    { dia: "", local: 50, externa: 30 },
    { dia: "10 out", local: 65, externa: 45 },
    { dia: "", local: 45, externa: 25 },
    { dia: "", local: 55, externa: 35 },
    { dia: "", local: 60, externa: 40 },
    { dia: "", local: 80, externa: 60 },
    { dia: "15 out", local: 75, externa: 55 },
    { dia: "", local: 50, externa: 30 },
    { dia: "", local: 65, externa: 45 },
    { dia: "", local: 55, externa: 35 },
    { dia: "", local: 45, externa: 25 },
    { dia: "20 out", local: 70, externa: 40 },
    { dia: "", local: 60, externa: 30 },
    { dia: "", local: 80, externa: 50 },
    { dia: "", local: 90, externa: 65 },
    { dia: "", local: 75, externa: 45 },
    { dia: "25 out", local: 85, externa: 55 },
    { dia: "", local: 95, externa: 70 },
    { dia: "", local: 70, externa: 40 },
    { dia: "", local: 80, externa: 50 },
    { dia: "", local: 90, externa: 60 },
    { dia: "", local: 100, externa: 65 },
    { dia: "31 out", local: 85, externa: 50 },
  ].map((bar, index) => ({ ...bar, date: `2026-10-${index + 1}` }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Gráfico de Barras: Requisições por tipo de processamento */}
      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-[#2B333F]">
              Requisições por tipo de processamento
            </h3>
            <p className="text-[10px] text-slate-400">
              Comparativo entre processamentos locais e chamadas externas.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2B333F]" /> Processamentos locais
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8E191]" /> APIs externas
            </span>
          </div>
        </div>

        {/* Área do Gráfico de Barras Empilhadas */}
        <div className="pt-2">
          <div className="h-48 flex items-end justify-between gap-1 border-b border-slate-100 pb-1 px-1">
            {barras.map((b) => {
              const alturaLocal = (b.local / 180) * 100;
              const alturaExterna = (b.externa / 180) * 100;
              return (
                <div
                  key={b.date}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip ao passar o rato */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#2B333F] text-white text-[9px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                    {b.local + b.externa} reqs
                  </div>

                  {/* Barra Amarela (APIs externas - Topo) */}
                  <div
                    className="w-full bg-[#E8E191] rounded-t-xs transition-all"
                    style={{ height: `${alturaExterna}%` }}
                  />
                  {/* Barra Azul (Locais - Base) */}
                  <div
                    className="w-full bg-[#2B333F] rounded-b-xs transition-all"
                    style={{ height: `${alturaLocal}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Eixo X - Datas */}
          <div className="flex justify-between text-[10px] text-slate-400 pt-2 px-1">
            <span>1 out</span>
            <span>5 out</span>
            <span>10 out</span>
            <span>15 out</span>
            <span>20 out</span>
            <span>25 out</span>
            <span>31 out</span>
          </div>
        </div>
      </div>

      {/* 2. Gráfico Donut: Distribuição de custos por modelo */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
        <div>
          <h3 className="text-xs font-bold text-[#2B333F]">Distribuição de custos por modelo</h3>
          <p className="text-[10px] text-slate-400">
            Custo total por modelo de IA (APIs externas).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
          {/* Donut SVG em Anel */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg aria-hidden="true" className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Fundo do Anel */}
              <path
                stroke="#E2E8F0"
                strokeWidth="4.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* GPT-4o (46.9%) */}
              <path
                stroke="#2B333F"
                strokeWidth="4.5"
                strokeDasharray="47, 100"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* Claude 3.5 (27.4%) */}
              <path
                stroke="#E8E191"
                strokeWidth="4.5"
                strokeDasharray="27, 100"
                strokeDashoffset="-47"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* Gemini 1.5 (16.5%) */}
              <path
                stroke="#64748B"
                strokeWidth="4.5"
                strokeDasharray="16.5, 100"
                strokeDashoffset="-74"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />

              {/* Outros (9.1%) */}
              <path
                stroke="#CBD5E1"
                strokeWidth="4.5"
                strokeDasharray="9, 100"
                strokeDashoffset="-90.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute text-center">
              <span className="text-xs font-black text-[#2B333F] block leading-tight">
                R$ 68,40
              </span>
              <span className="text-[9px] text-slate-400 font-medium">gasto no mês</span>
            </div>
          </div>

          {/* Legenda e Lista de Modelos */}
          <div className="space-y-2.5 w-full text-xs">
            {modelos.map((m) => (
              <div key={m.nome} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${m.cor}`} />
                  <span className="font-semibold text-[#2B333F]">{m.nome}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#2B333F]">{m.valor}</span>
                  <span className="text-[10px] text-slate-400 font-medium w-9 text-right">
                    {m.pct}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
