import { ArrowUpRight, Pause, Play, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";

function SourceStatus({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium ${active ? "text-emerald-700" : "text-[#8190A8]"}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-[#A7B3C5]"}`}
      />
      {active ? "Ativa" : "Pausada"}
    </span>
  );
}
function SourceName({ source, onEdit }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EEF2F8] text-[#526584]"
      >
        <Rss className="size-4" />
      </span>
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => onEdit(source)}
          className="text-left text-sm font-medium text-wisen-titulo outline-none hover:underline focus-visible:underline"
        >
          {source.nome}
        </button>
        <p className="mt-1 max-w-sm break-all text-xs leading-5 text-[#7182A1]">{source.url}</p>
      </div>
    </div>
  );
}
function SourceActions({ source, onEdit, onToggle, busy }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1">
      <Button
        variant="ghost"
        disabled={busy}
        onClick={() => onEdit(source)}
        aria-label={`Editar ${source.nome}`}
        className="text-xs text-[#526584] hover:bg-wisen-admin-hover"
      >
        Gerenciar
        <ArrowUpRight className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={busy}
        onClick={() => onToggle(source)}
        aria-label={`${source.ativo ? "Pausar" : "Ativar"} ${source.nome}`}
        className="size-8 text-[#7182A1] hover:bg-wisen-admin-hover"
      >
        {source.ativo ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
      </Button>
    </div>
  );
}
export default function TabelaFontes({ fontes, aoEditar, aoAlternarStatus, busy }) {
  if (!fontes.length)
    return (
      <div className="px-5 py-14 text-center">
        <h3 className="text-sm font-medium text-wisen-titulo">Nenhuma fonte encontrada</h3>
        <p className="mt-2 text-sm text-[#7182A1]">
          Tente outro nome, endereço ou combinação de filtros.
        </p>
      </div>
    );
  return (
    <div className="@container/sources min-w-0">
      <div className="hidden overflow-x-auto @min-[48rem]/sources:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Fontes RSS cadastradas e configurações de coleta</caption>
          <thead className="border-y border-[#E8EDF4] bg-[#FAFBFD]">
            <tr className="text-[10px] font-semibold tracking-wider text-[#8190A8] uppercase">
              <th scope="col" className="px-5 py-3">
                Fonte
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Última coleta
              </th>
              <th scope="col" className="px-4 py-3">
                Frequência
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                <span className="sr-only">Gerenciar fonte</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDF0F5]">
            {fontes.map((source) => (
              <tr key={source.id} className="transition-colors hover:bg-wisen-admin-hover">
                <td className="px-5 py-4">
                  <SourceName source={source} onEdit={aoEditar} />
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <SourceStatus active={source.ativo} />
                </td>
                <td className="px-4 py-4 text-xs leading-5 tabular-nums text-[#7182A1]">
                  {source.ultimaColeta}
                </td>
                <td className="px-4 py-4 text-xs text-[#7182A1]">{source.frequencia}</td>
                <td className="px-5 py-4">
                  <SourceActions
                    source={source}
                    onEdit={aoEditar}
                    onToggle={aoAlternarStatus}
                    busy={busy}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#E8EDF4] border-t border-[#E8EDF4] @min-[48rem]/sources:hidden">
        {fontes.map((source) => (
          <article key={source.id} className="min-w-0 space-y-4 p-4 sm:p-5">
            <SourceName source={source} onEdit={aoEditar} />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <SourceStatus active={source.ativo} />
              <span className="text-xs text-[#7182A1]">{source.frequencia}</span>
            </div>
            <p className="text-xs leading-5 text-[#7182A1]">Última coleta: {source.ultimaColeta}</p>
            <div className="border-t border-[#E8EDF4] pt-3">
              <SourceActions
                source={source}
                onEdit={aoEditar}
                onToggle={aoAlternarStatus}
                busy={busy}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
