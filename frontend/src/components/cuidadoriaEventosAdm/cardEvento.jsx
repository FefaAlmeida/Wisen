import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatusEvento({ reviewed }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${reviewed ? "bg-emerald-100 text-emerald-800" : "bg-[#FBF4D5] text-[#725A13]"}`}
    >
      {reviewed ? "Revisado" : "A revisar"}
    </span>
  );
}

export default function CardEvento({ evento, aoRevisar, busy }) {
  const reviewed = evento.status === "Revisado";
  const articleCount = evento.artigos.length;
  return (
    <article className="grid min-w-0 items-center gap-x-5 gap-y-3 px-4 py-4 transition-colors hover:bg-[#FBF7E5] sm:px-5 @min-[38rem]/curadoria:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold leading-6 break-words text-wisen-titulo">
          {evento.titulo}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-wisen-texto-suave">
          <StatusEvento reviewed={reviewed} />
          <span className="break-words">{evento.categoria}</span>
          <span>
            {articleCount} {articleCount === 1 ? "artigo" : "artigos"}
          </span>
          <span className="tabular-nums">{evento.data}</span>
        </div>
        {evento.resumo && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 break-words text-wisen-texto-suave">
            {evento.resumo}
          </p>
        )}
      </div>
      <Button
        onClick={() => aoRevisar(evento)}
        disabled={busy}
        aria-label={`${reviewed ? "Ver revisão de" : "Revisar evento:"} ${evento.titulo}`}
        variant="outline"
        size="sm"
        className="justify-self-start border-wisen-borda text-xs text-wisen-texto-forte hover:bg-wisen-destaque-suave active:bg-wisen-destaque-suave @min-[38rem]/curadoria:hover:bg-wisen-admin-hover"
      >
        {reviewed ? "Ver revisão" : "Revisar evento"}
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </Button>
    </article>
  );
}
