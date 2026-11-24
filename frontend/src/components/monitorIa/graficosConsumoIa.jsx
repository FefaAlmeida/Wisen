const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percentual = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export function GraficosConsumoIa() {
  const modelos = [
    { nome: "GPT-4o", centavos: 3210 },
    { nome: "Claude 3.5", centavos: 1875 },
    { nome: "Gemini 1.5", centavos: 1130 },
    { nome: "Outros", centavos: 625 },
  ].sort((a, b) => b.centavos - a.centavos);
  const totalCentavos = modelos.reduce((total, modelo) => total + modelo.centavos, 0);

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-wisen-borda bg-white p-5 shadow-2xs lg:col-span-7">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-[#2B333F]">
            Requisições por tipo de processamento
          </h3>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#52647C]" />
              Processamentos locais
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#E7CC72]" />
              APIs externas
            </li>
          </ul>
        </div>

        <div className="mt-auto pb-6">
          <div className="flex h-48 items-end gap-0.5 border-b border-slate-100 pb-1 sm:gap-1">
            {barras.map((b, index) => {
              const alturaLocal = (b.local / 180) * 100;
              const alturaExterna = (b.externa / 180) * 100;
              const visibilidadeData = index % 10 === 4 ? "hidden sm:block" : "";
              return (
                <div
                  key={b.date}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  <div className="pointer-events-none absolute -top-8 z-20 whitespace-nowrap rounded-lg bg-[#2B333F] px-2 py-1 text-[11px] text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    {b.local + b.externa} reqs
                  </div>

                  <div
                    className="w-full rounded-t-xs bg-[#E7CC72]"
                    style={{ height: `${alturaExterna}%` }}
                  />
                  <div
                    className="w-full rounded-b-xs bg-[#52647C]"
                    style={{ height: `${alturaLocal}%` }}
                  />
                  {b.dia && (
                    <span
                      className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-slate-500 group-first:left-0 group-first:translate-x-0 group-last:right-0 group-last:left-auto group-last:translate-x-0 ${visibilidadeData}`}
                    >
                      {b.dia}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-5 rounded-2xl border border-wisen-borda bg-white p-5 shadow-2xs lg:col-span-5">
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-[#2B333F]">
            Distribuição de custos por modelo
          </h3>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-2xl leading-tight font-semibold tabular-nums text-[#2B333F]">
              {moeda.format(totalCentavos / 100)}
            </span>
            <span className="text-xs text-slate-500">em APIs externas no mês</span>
          </p>
        </div>

        <ul className="space-y-3">
          {modelos.map(({ nome, centavos }) => {
            const proporcao = centavos / totalCentavos;

            return (
              <li key={nome} className="space-y-1.5">
                <div className="grid grid-cols-[1fr_auto_6ch] items-baseline gap-x-2 text-sm tabular-nums">
                  <span className="font-medium text-[#2B333F]">{nome}</span>
                  <span className="text-right font-semibold text-[#2B333F]">
                    {moeda.format(centavos / 100)}
                  </span>
                  <span className="text-right text-xs text-slate-500">
                    {percentual.format(proporcao)}
                  </span>
                </div>
                <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#E7CC72]"
                    style={{ width: `${proporcao * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
