import { BarChart2, CalendarDays, FileText, Lightbulb, UserPlus } from "lucide-react";

export function GraficosAtividadeAdm() {
  const temas = [
    { nome: "Economia", pct: "28%", cor: "bg-[#D7BF4D]" },
    { nome: "Meio ambiente", pct: "22%", cor: "bg-[#30466E]" },
    { nome: "Tecnologia", pct: "18%", cor: "bg-[#7182A1]" },
    { nome: "Saúde", pct: "12%", cor: "bg-[#A9B8CB]" },
    { nome: "Política", pct: "10%", cor: "bg-[#EBDD80]" },
    { nome: "Sociedade", pct: "10%", cor: "bg-[#E3E9F1]" },
  ];

  const atividades = [
    { icone: UserPlus, texto: "Novo usuário cadastrado", tempo: "há 5 minutos" },
    { icone: FileText, texto: "Conteúdo publicado", tempo: "há 32 minutos" },
    { icone: CalendarDays, texto: "Evento atualizado", tempo: "há 1 hora" },
    { icone: Lightbulb, texto: "Conceito adicionado", tempo: "há 2 horas" },
    { icone: BarChart2, texto: "Relatório gerado", tempo: "há 3 horas" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* 1. Gráfico de Linha (Evolução de Usuários) */}
      <div className="admin-chart-card space-y-4 rounded-lg border border-[#E3E9F1] bg-white p-5 shadow-2xs lg:col-span-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-wisen-titulo">
              Evolução de usuários ativos
            </h3>
            <p className="text-xs text-[#7182A1]">Comparativo dos últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-[#9A7E14]">
              <span className="w-2 h-2 rounded-full bg-[#D7BF4D]" /> Ativos
            </span>
            <span className="flex items-center gap-1 text-[#7182A1]">
              <span className="w-2 h-2 rounded-full bg-[#A9B8CB]" /> Novos
            </span>
          </div>
        </div>

        {/* Gráfico SVG de Linha/Área */}
        <div className="relative flex h-64 w-full flex-col justify-between pt-4">
          <svg
            aria-hidden="true"
            className="w-full h-full overflow-visible"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#F1F5F9" strokeWidth="1" />

            <path
              className="admin-chart-line admin-chart-line-secondary"
              pathLength={1}
              d="M 0 90 Q 80 80, 160 65 T 320 50 T 400 40"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />

            <path
              className="admin-chart-line admin-chart-line-primary"
              pathLength={1}
              d="M 0 70 Q 80 50, 160 35 T 320 20 T 400 15"
              fill="none"
              stroke="#D7BF4D"
              strokeWidth="3"
            />

            <circle className="admin-chart-point" cx="400" cy="15" r="4" fill="#D6B92F" />
          </svg>

          <div className="flex justify-between border-t border-[#E3E9F1] pt-2 text-xs text-[#7182A1]">
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
            <span>Set</span>
          </div>
        </div>
      </div>

      {/* 2. Gráfico Donut (Distribuição dos Temas) */}
      <div className="admin-chart-card admin-chart-card-delayed space-y-4 rounded-lg border border-[#E3E9F1] bg-white p-5 shadow-2xs lg:col-span-6">
        <div>
          <h3 className="text-base font-semibold text-wisen-titulo">
            Distribuição dos temas mais acessados
          </h3>
          <p className="text-xs text-[#7182A1]">Baseado nas leituras e revisões dos usuários</p>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center xl:h-48 xl:w-48">
            <svg aria-hidden="true" className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                stroke="#E2E8F0"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="admin-chart-segment-yellow"
                stroke="#EBDD80"
                strokeWidth="4"
                strokeDasharray="28, 100"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="admin-chart-segment-dark"
                stroke="#30466E"
                strokeWidth="4"
                strokeDasharray="22, 100"
                strokeDashoffset="-28"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="block text-base font-bold leading-none text-wisen-titulo">
                1.248
              </span>
              <span className="text-sm text-[#7182A1]">acessos</span>
            </div>
          </div>

          <div className="w-fit space-y-2 text-sm">
            {temas.map((item) => (
              <div key={item.nome} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.cor}`} />
                  <span className="font-medium text-[#526584]">{item.nome}</span>
                </div>
                <span className="min-w-10 text-right font-bold text-wisen-titulo">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Atividade Recente */}
      <div className="space-y-4 rounded-lg border border-[#263343] bg-[#263343] p-5 shadow-2xs lg:col-span-12">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Atividade recente</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {atividades.map((item) => {
            const Icone = item.icone;
            return (
              <div
                key={item.texto}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.065] p-3 text-sm transition-colors hover:bg-white/[0.1]"
              >
                <div className="mt-0.5 shrink-0 rounded-lg bg-[#F3E69A] p-1.5 text-[#263343]">
                  <Icone className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="truncate font-semibold text-white">{item.texto}</h4>
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
