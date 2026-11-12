import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  Filter,
  Laptop,
  MoreVertical,
  Search,
} from "lucide-react";

export function TabelaLogsIa() {
  const logs = [
    {
      dataHora: "23/10/2026 14:32",
      modelo: "GPT-4o",
      tipo: "API externa",
      isCloud: true,
      operacao: "Resumo de notícia",
      tokens: "1.240 / 390",
      latencia: "3,2 s",
      custo: "0,042",
      status: "Sucesso",
    },
    {
      dataHora: "23/10/2026 14:18",
      modelo: "Transformers.js",
      tipo: "Local",
      isCloud: false,
      operacao: "Extração de conceitos",
      tokens: "950 / 210",
      latencia: "1,1 s",
      custo: "0,000",
      status: "Sucesso",
    },
    {
      dataHora: "23/10/2026 13:55",
      modelo: "Claude 3.5",
      tipo: "API externa",
      isCloud: true,
      operacao: "Relacionamento de conceitos",
      tokens: "1.560 / 420",
      latencia: "4,8 s",
      custo: "0,065",
      status: "Sucesso",
    },
    {
      dataHora: "23/10/2026 12:41",
      modelo: "ONNX (Local)",
      tipo: "Local",
      isCloud: false,
      operacao: "Classificação de tema",
      tokens: "620 / 180",
      latencia: "0,9 s",
      custo: "0,000",
      status: "Sucesso",
    },
    {
      dataHora: "23/10/2026 11:07",
      modelo: "Gemini 1.5",
      tipo: "API externa",
      isCloud: true,
      operacao: "Geração de explicação",
      tokens: "1.800 / 560",
      latencia: "5,1 s",
      custo: "0,071",
      status: "Sucesso",
    },
  ];

  return (
    <div className="space-y-5 rounded-lg border border-slate-200/80 bg-white p-6 shadow-2xs">
      {/* Cabeçalho da Tabela com Busca e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#2B333F]">Logs de chamadas de IA</h3>
          <p className="text-sm text-slate-500">
            Registros individuais de cada requisição, com detalhes de consumo, latência e custo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por modelo, operação ou ID..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#EBDD80]/60"
            />
          </div>

          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#FBF7E5]"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <th className="py-3 px-2">Data e hora</th>
              <th className="py-3 px-2">Modelo</th>
              <th className="py-3 px-2">Tipo</th>
              <th className="py-3 px-2">Operação</th>
              <th className="py-3 px-2">Tokens (entrada / saída)</th>
              <th className="py-3 px-2">Latência</th>
              <th className="py-3 px-2">Custo (R$)</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((item) => (
              <tr
                key={`${item.dataHora}-${item.modelo}`}
                className="transition-colors hover:bg-[#FBF7E5]"
              >
                <td className="py-3.5 px-2 text-slate-500 font-medium whitespace-nowrap">
                  {item.dataHora}
                </td>

                <td className="py-3.5 px-2 font-bold text-[#2B333F] whitespace-nowrap">
                  {item.modelo}
                </td>

                <td className="py-3.5 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    {item.isCloud ? (
                      <Cloud className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{item.tipo}</span>
                  </div>
                </td>

                <td className="py-3.5 px-2 text-slate-600 font-medium whitespace-nowrap">
                  {item.operacao}
                </td>

                <td className="py-3.5 px-2 text-slate-500 whitespace-nowrap">{item.tokens}</td>

                <td className="py-3.5 px-2 text-slate-500 font-medium whitespace-nowrap">
                  {item.latencia}
                </td>

                <td className="py-3.5 px-2 font-bold text-[#2B333F] whitespace-nowrap">
                  {item.custo}
                </td>

                <td className="py-3.5 px-2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item.status}
                  </span>
                </td>

                <td className="py-3.5 px-2 text-right whitespace-nowrap">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg p-1 text-slate-500 transition-colors hover:bg-[#EBDD80] hover:text-[#2B333F]"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-3 text-sm font-medium text-slate-500 sm:flex-row">
        <span>Mostrando 1-5 de 1.248 requisições</span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-[#FBF7E5]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EBDD80] text-sm font-semibold text-[#202D3A]"
          >
            1
          </button>
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-[#EBDD80]"
          >
            2
          </button>
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-[#EBDD80]"
          >
            3
          </button>
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-[#EBDD80]"
          >
            4
          </button>
          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-[#EBDD80]"
          >
            5
          </button>

          <span className="px-1 text-slate-400">...</span>

          <button
            type="button"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-medium text-slate-600 transition-colors hover:bg-[#EBDD80]"
          >
            250
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-[#FBF7E5]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
