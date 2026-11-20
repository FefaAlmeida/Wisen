import Link from "next/link";

export function TabelasDesempenhoAdm() {
  const usuarios = [
    {
      nome: "Mariana Costa",
      revisoes: 128,
      leituras: 56,
      tempo: "12h 20min",
      nivel: "Avançado",
      corNivel: "bg-[#EBDD80]/50 text-[#2B333F]",
    },
    {
      nome: "Lucas Almeida",
      revisoes: 98,
      leituras: 48,
      tempo: "9h 15min",
      nivel: "Intermediário",
      corNivel: "bg-emerald-100 text-emerald-800",
    },
    {
      nome: "Fernanda Lima",
      revisoes: 92,
      leituras: 42,
      tempo: "8h 40min",
      nivel: "Intermediário",
      corNivel: "bg-emerald-100 text-emerald-800",
    },
    {
      nome: "João Ferreira",
      revisoes: 78,
      leituras: 38,
      tempo: "7h 10min",
      nivel: "Básico",
      corNivel: "bg-sky-100 text-sky-800",
    },
    {
      nome: "Carla Santos",
      revisoes: 72,
      leituras: 35,
      tempo: "6h 25min",
      nivel: "Básico",
      corNivel: "bg-sky-100 text-sky-800",
    },
  ];

  const conteudos = [
    { titulo: "Taxa Selic e seus impactos", categoria: "Economia", views: "1.420" },
    { titulo: "Derretimento das geleiras", categoria: "Meio ambiente", views: "1.230" },
    { titulo: "Inteligência artificial na educação", categoria: "Tecnologia", views: "980" },
    { titulo: "Vacinação e saúde pública", categoria: "Saúde", views: "810" },
    { titulo: "Eleições e o cenário político", categoria: "Política", views: "755" },
  ];

  const lacunas = [
    { conceito: "Taxa Selic", lacunas: 342, pct: "27%" },
    { conceito: "Efeito estufa", lacunas: 298, pct: "24%" },
    { conceito: "Aprendizado de máquina", lacunas: 276, pct: "22%" },
    { conceito: "Inflação", lacunas: 261, pct: "21%" },
    { conceito: "Democracia", lacunas: 238, pct: "19%" },
  ];

  return (
    <div className="@container min-w-0">
      <div className="grid min-w-0 grid-cols-1 gap-6 @min-[40rem]:grid-cols-2">
        {/* 1. Utilizadores Mais Ativos */}
        <div className="col-span-full min-w-0 space-y-4 rounded-lg border border-[#E3E9F1] bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E9F1] pb-3">
            <h3 className="text-base font-semibold text-[#9A7E14]">Usuários mais ativos</h3>
            <Link
              href="/paginaGestaoUsuariosAdm"
              className="text-sm font-semibold text-[#30466E] transition-colors hover:text-[#D6B92F]"
            >
              Ver todos →
            </Link>
          </div>

          <div className="max-w-full overflow-x-auto overscroll-x-contain pt-3">
            <table className="w-full min-w-[540px] text-left text-sm [&_td]:pr-4 [&_th]:pr-4 [&_td:last-child]:pr-0 [&_th:last-child]:pr-0">
              <thead>
                <tr className="border-b border-[#E3E9F1] text-xs font-semibold text-[#7182A1] uppercase">
                  <th className="pb-2">Usuário</th>
                  <th className="pb-2">Revisões</th>
                  <th className="pb-2">Leituras</th>
                  <th className="pb-2">Tempo</th>
                  <th className="pb-2">Nível</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E9F1]">
                {usuarios.map((item) => (
                  <tr
                    key={item.nome}
                    className="cursor-pointer transition-colors hover:bg-wisen-admin-hover"
                  >
                    <td className="py-2.5 font-bold text-wisen-titulo">{item.nome}</td>
                    <td className="py-2.5 text-[#7182A1]">{item.revisoes}</td>
                    <td className="py-2.5 text-[#7182A1]">{item.leituras}</td>
                    <td className="py-2.5 text-[#7182A1]">{item.tempo}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.corNivel}`}
                      >
                        {item.nivel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Conteúdos Mais Acessados */}
        <div className="min-w-0 space-y-4 rounded-lg border border-[#E3E9F1] bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E9F1] pb-3">
            <h3 className="text-base font-semibold text-[#9A7E14]">Conteúdos mais acessados</h3>
          </div>

          <div className="space-y-3 pt-3 text-sm">
            {conteudos.map((item) => (
              <div
                key={item.titulo}
                className="flex min-w-0 cursor-pointer items-center justify-between gap-3 rounded-md border-b border-[#E3E9F1] px-2 py-2 transition-colors hover:bg-wisen-admin-hover last:border-0"
              >
                <div className="min-w-0">
                  <h4 className="break-words font-bold text-wisen-titulo">{item.titulo}</h4>
                  <span className="text-xs text-[#7182A1]">{item.categoria}</span>
                </div>
                <span className="shrink-0 rounded-lg bg-[#FBF7E5] px-2 py-1 text-xs font-bold text-[#9A7E14]">
                  {item.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Conceitos Com Mais Lacunas */}
        <div className="min-w-0 space-y-4 rounded-lg border border-[#E3E9F1] bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E3E9F1] pb-3">
            <h3 className="text-base font-semibold text-[#9A7E14]">Conceitos com mais lacunas</h3>
          </div>

          <div className="space-y-3 pt-3 text-sm">
            {lacunas.map((item) => (
              <div
                key={item.conceito}
                className="cursor-pointer space-y-1 rounded-md border-b border-[#E3E9F1] px-2 py-2 transition-colors hover:bg-wisen-admin-hover last:border-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 break-words font-medium text-wisen-titulo">
                    {item.conceito}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-[#9A7E14]">{item.pct}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DCE3ED]">
                  <div className="h-1.5 rounded-full bg-[#D7BF4D]" style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
