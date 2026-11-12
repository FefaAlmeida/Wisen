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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* 1. Utilizadores Mais Ativos */}
      <div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#2B333F]">Usuários mais ativos</h3>
          <Link
            href="/paginaGestaoUsuariosAdm"
            className="text-sm font-semibold text-[#30466E] transition-colors hover:text-[#D6B92F]"
          >
            Ver todos →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                <th className="pb-2">Usuário</th>
                <th className="pb-2">Revisões</th>
                <th className="pb-2">Leituras</th>
                <th className="pb-2">Tempo</th>
                <th className="pb-2">Nível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((item) => (
                <tr key={item.nome} className="transition-colors hover:bg-[#FBF7E5]">
                  <td className="py-2.5 font-bold text-[#2B333F]">{item.nome}</td>
                  <td className="py-2.5 text-slate-500">{item.revisoes}</td>
                  <td className="py-2.5 text-slate-500">{item.leituras}</td>
                  <td className="py-2.5 text-slate-500">{item.tempo}</td>
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
      <div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#2B333F]">Conteúdos mais acessados</h3>
        </div>

        <div className="space-y-3 text-sm">
          {conteudos.map((item) => (
            <div
              key={item.titulo}
              className="flex items-center justify-between pb-2 border-b border-slate-100 last:border-0"
            >
              <div>
                <h4 className="font-bold text-[#2B333F] truncate">{item.titulo}</h4>
                <span className="text-xs text-slate-500">{item.categoria}</span>
              </div>
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-[#2B333F]">
                {item.views}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Conceitos Com Mais Lacunas */}
      <div className="space-y-4 rounded-lg border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#2B333F]">Conceitos com mais lacunas</h3>
        </div>

        <div className="space-y-3 text-sm">
          {lacunas.map((item) => (
            <div key={item.conceito} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2B333F]">{item.conceito}</span>
                <span className="text-xs font-semibold text-slate-500">{item.pct}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-1.5 rounded-full bg-[#EBDD80]" style={{ width: item.pct }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
