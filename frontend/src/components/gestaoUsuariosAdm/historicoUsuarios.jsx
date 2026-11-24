import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoricoUsuarios({
  items,
  user,
  demo,
  loading,
  error,
  onShowAll,
  onReturnToAccount,
}) {
  return (
    <section
      aria-labelledby="historico-usuarios-titulo"
      className="overflow-hidden rounded-2xl border border-wisen-borda bg-white shadow-2xs"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-wisen-borda px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2
            id="historico-usuarios-titulo"
            className="break-words font-semibold text-wisen-titulo"
          >
            {user ? `Histórico de ${user.nome}` : "Linha do tempo"}
          </h2>
          <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
            {demo
              ? "Alterações realizadas nas contas de demonstração neste navegador."
              : "Alterações de acesso e limites registradas pelos administradores."}
          </p>
        </div>
        {user && (
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={onReturnToAccount}>
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Voltar à conta
            </Button>
            <Button variant="outline" size="sm" onClick={onShowAll}>
              Ver todas as alterações
            </Button>
          </div>
        )}
      </header>

      {loading ? (
        <p role="status" className="p-8 text-center text-sm text-wisen-texto-suave">
          Carregando histórico...
        </p>
      ) : items.length ? (
        <ol aria-label="Alterações mais recentes primeiro" className="px-4 py-5 sm:px-5">
          {items.map((entry) => (
            <li
              key={entry.id}
              className="relative pb-3 pl-6 last:pb-0 before:absolute before:top-5 before:bottom-[-1.25rem] before:left-[5px] before:w-px before:bg-wisen-borda last:before:hidden"
            >
              <span
                aria-hidden="true"
                className="absolute top-4 left-0 size-[11px] rounded-full border-2 border-white bg-[#B29B31] ring-1 ring-wisen-borda"
              />
              <article className="rounded-xl border border-wisen-borda bg-wisen-superficie/45 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="min-w-0 break-words text-sm font-semibold text-wisen-titulo">
                    {entry.usuario}
                  </h3>
                  <span className="text-xs text-wisen-texto-suave">{entry.data}</span>
                </div>
                <p className="mt-1 break-words text-sm leading-6 text-wisen-texto-suave">
                  {entry.descricao}
                </p>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        !error && (
          <div className="px-4 py-9 text-center">
            <span className="mx-auto mb-3 grid size-9 place-items-center rounded-xl bg-wisen-cliente-hover text-wisen-titulo">
              <History aria-hidden="true" className="size-4" />
            </span>
            <p className="text-sm font-semibold text-wisen-titulo">Nenhuma alteração registrada</p>
            <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
              As mudanças salvas nas configurações das contas aparecem aqui.
            </p>
          </div>
        )
      )}
    </section>
  );
}
