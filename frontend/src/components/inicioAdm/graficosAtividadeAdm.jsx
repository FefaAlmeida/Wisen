import { BarChart2, CalendarDays, FileText, Lightbulb, UserPlus } from "lucide-react";

export function GraficosAtividadeAdm() {
  const temas = [
    { nome: "Economia", pct: "28%", cor: "bg-[#D7BF4D]", stroke: "#D7BF4D" },
    { nome: "Meio ambiente", pct: "22%", cor: "bg-[#30466E]", stroke: "#30466E" },
    { nome: "Tecnologia", pct: "18%", cor: "bg-[#7182A1]", stroke: "#7182A1" },
    { nome: "Saúde", pct: "12%", cor: "bg-[#A9B8CB]", stroke: "#A9B8CB" },
    { nome: "Política", pct: "10%", cor: "bg-[#EBDD80]", stroke: "#EBDD80" },
    { nome: "Sociedade", pct: "10%", cor: "bg-[#E3E9F1]", stroke: "#E3E9F1" },
  ];

  const atividades = [
    { icone: UserPlus, texto: "Novo usuário cadastrado", tempo: "há 5 minutos" },
    { icone: FileText, texto: "Conteúdo publicado", tempo: "há 32 minutos" },
    { icone: CalendarDays, texto: "Evento atualizado", tempo: "há 1 hora" },
    { icone: Lightbulb, texto: "Conceito adicionado", tempo: "há 2 horas" },
    { icone: BarChart2, texto: "Relatório gerado", tempo: "há 3 horas" },
  ];

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Evolucao de usuarios */}
      <section className="admin-chart-card flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E3E9F1] bg-white shadow-2xs">
        <header className="flex min-h-24 items-center border-b border-[#E8EDF4] px-5 py-5 sm:px-6">
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-medium leading-snug tracking-tight text-wisen-titulo sm:text-xl">
              Evolução dos usuários
            </h3>
            <span aria-hidden="true" className="block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
            <p className="text-xs leading-5 text-[#7182A1]">Ativos e novos nos últimos 6 meses</p>
          </div>
        </header>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex min-h-64 flex-1 flex-col rounded-xl border border-[#E8EDF4] bg-[#F8FAFD] px-4 pt-5 pb-3 sm:min-h-72 sm:px-5">
            <div className="relative min-h-48 flex-1">
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="-4 0 408 120"
                preserveAspectRatio="none"
              >
                {[20, 60, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="400"
                    y2={y}
                    stroke="#E3E9F1"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <path
                  className="admin-chart-line admin-chart-line-secondary"
                  pathLength={1}
                  d="M 0 90 Q 80 80, 160 65 T 320 50 T 400 40"
                  fill="none"
                  stroke="#A9B8CB"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="admin-chart-line admin-chart-line-primary"
                  pathLength={1}
                  d="M 0 70 Q 80 50, 160 35 T 320 20 T 400 15"
                  fill="none"
                  stroke="#D7BF4D"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
                <circle className="admin-chart-point" cx="400" cy="15" r="3" fill="#D7BF4D" />
              </svg>
            </div>
            <div className="mt-4 flex justify-between border-t border-[#E3E9F1] pt-3 text-[11px] text-[#7182A1] sm:text-xs">
              {["Abr", "Mai", "Jun", "Jul", "Ago", "Set"].map((mes) => (
                <span key={mes}>{mes}</span>
              ))}
            </div>
          </div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EDF4] bg-[#FCFDFF] px-5 py-3 sm:px-6">
          <span className="text-xs text-[#7182A1]">Usuários por mês</span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#526584]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D7BF4D]" />
              Ativos
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#A9B8CB]" />
              Novos
            </span>
          </div>
        </footer>
      </section>

      {/* Distribuicao dos temas */}
      <section className="admin-chart-card admin-chart-card-delayed @container/chart flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E3E9F1] bg-white shadow-2xs">
        <header className="flex min-h-24 items-center border-b border-[#E8EDF4] px-5 py-5 sm:px-6">
          <div className="min-w-0 space-y-1">
            <h3 className="text-lg font-medium leading-snug tracking-tight text-wisen-titulo sm:text-xl">
              Temas mais acessados
            </h3>
            <span aria-hidden="true" className="block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
            <p className="text-xs leading-5 text-[#7182A1]">Distribuição das leituras e revisões</p>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-5 p-4 sm:p-5 @min-[28rem]/chart:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="flex min-w-0 items-center justify-center rounded-xl border border-[#E8EDF4] bg-[#F8FAFD] px-3 py-6">
            <div className="relative flex size-40 shrink-0 items-center justify-center @min-[36rem]/chart:size-44">
              <svg aria-hidden="true" className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                {temas.map((item, index) => (
                  <circle
                    key={item.nome}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    pathLength="100"
                    fill="none"
                    stroke={item.stroke}
                    strokeWidth="3.5"
                    strokeDasharray={`${Number.parseFloat(item.pct)} ${100 - Number.parseFloat(item.pct)}`}
                    strokeDashoffset={
                      -temas
                        .slice(0, index)
                        .reduce((sum, tema) => sum + Number.parseFloat(tema.pct), 0)
                    }
                  />
                ))}
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl font-semibold tracking-tight text-wisen-titulo">
                  1.248
                </span>
                <span className="mt-1 block text-xs text-[#7182A1]">acessos no total</span>
              </div>
            </div>
          </div>

          <div className="min-w-0 self-center">
            <div className="mb-1 flex items-center justify-between gap-2 px-2 pb-2 text-[10px] font-semibold tracking-wider text-[#7182A1] uppercase">
              <span>Tema</span>
              <span>Participação</span>
            </div>
            <div className="divide-y divide-[#E8EDF4]">
              {temas.map((item) => (
                <div
                  key={item.nome}
                  className="flex items-center justify-between gap-2 px-2 py-2.5 text-xs sm:text-sm"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${item.cor}`} />
                    <span className="min-w-0 break-words font-medium text-[#526584]">
                      {item.nome}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums text-wisen-titulo">
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Atividade Recente */}
      <div className="col-span-full min-w-0 space-y-4 rounded-lg border border-[#263343] bg-[#263343] p-5 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-white">Atividade recente</h3>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
          {atividades.map((item) => {
            const Icone = item.icone;
            return (
              <div
                key={item.texto}
                className="flex h-auto min-h-24 min-w-0 items-start gap-3 rounded-lg border border-white/10 bg-white/[0.065] px-3 py-4 text-sm transition-colors hover:bg-white/[0.1]"
              >
                <div className="mt-0.5 shrink-0 rounded-lg bg-[#F3E69A] p-1.5 text-[#263343]">
                  <Icone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="whitespace-normal break-words font-semibold leading-5 text-white">
                    {item.texto}
                  </h4>
                  <p className="text-xs text-[#C6D0DD]">{item.tempo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
