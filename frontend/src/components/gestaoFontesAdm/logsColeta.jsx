import { History } from "lucide-react";

export default function LogsColeta({ logs, demo, loading, error }) {
  return (
    <section
      aria-labelledby="registros-coleta-titulo"
      className="min-w-0 overflow-hidden rounded-2xl border border-wisen-borda bg-card shadow-2xs"
    >
      <header className="border-b border-wisen-borda px-4 py-4 sm:px-5">
        <h2 id="registros-coleta-titulo" className="font-semibold text-wisen-titulo">
          Registros de coleta
        </h2>
        <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
          {demo
            ? "Registros ilustrativos de erros e avisos de coleta nesta demonstração."
            : "Últimos erros informados pelas fontes cadastradas."}
        </p>
      </header>
      {loading ? (
        <p role="status" className="p-8 text-center text-sm text-wisen-texto-suave">
          Carregando registros de coleta...
        </p>
      ) : logs.length ? (
        <ul className="space-y-3 px-4 py-5 sm:px-5">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-xl border border-wisen-borda bg-wisen-superficie/45 px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="min-w-0 break-words text-sm font-semibold text-wisen-titulo">
                  {log.fonte}
                </h3>
                <span
                  className={`text-xs font-medium ${log.status === "Falha" ? "text-[#9B6266]" : "text-[#866D16]"}`}
                >
                  {log.status}
                </span>
              </div>
              <p className="mt-1 break-words text-sm leading-6 text-wisen-texto-suave">
                {log.erro}
              </p>
              <p className="mt-1 text-xs text-wisen-texto-suave">{log.data}</p>
            </li>
          ))}
        </ul>
      ) : (
        !error && (
          <div className="px-4 py-9 text-center">
            <span className="mx-auto mb-3 grid size-9 place-items-center rounded-xl bg-wisen-cliente-hover text-wisen-titulo">
              <History aria-hidden="true" className="size-4" />
            </span>
            <p className="text-sm font-semibold text-wisen-titulo">
              Nenhum erro de coleta informado
            </p>
            <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
              Os erros informados pelas fontes aparecerão aqui.
            </p>
          </div>
        )
      )}
    </section>
  );
}
