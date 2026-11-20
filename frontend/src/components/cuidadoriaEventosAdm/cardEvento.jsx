import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MiniaturaCuradoria from "./miniaturaCuradoria";

export default function CardEvento({ evento, aoRevisar, busy }) {
  const reviewed = evento.status === "Revisado";
  return (
    <article className="min-w-0 rounded-xl border border-wisen-borda bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <MiniaturaCuradoria
          categoria={evento.categoria}
          titulo={evento.titulo}
          className="hidden size-12 shrink-0 sm:flex"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${reviewed ? "bg-emerald-50 text-emerald-700" : "bg-wisen-admin-hover text-[#866D16]"}`}
            >
              {reviewed ? "Revisado" : "A revisar"}
            </span>
            <span className="text-[#7182A1]">
              {evento.categoria} · {evento.artigos.length}{" "}
              {evento.artigos.length === 1 ? "artigo" : "artigos"}
            </span>
          </div>
          <h3 className="break-words text-base font-medium leading-6 text-wisen-titulo">
            {evento.titulo}
          </h3>
          <p className="mt-1.5 line-clamp-2 break-words text-sm leading-6 text-[#7182A1]">
            {evento.resumo ||
              "Este acontecimento ainda não tem um resumo. Confira os artigos e complete as informações."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EDF4] pt-3">
        <span className="text-xs text-[#7182A1]">{evento.data}</span>
        <Button
          onClick={() => aoRevisar(evento)}
          disabled={busy}
          aria-label={`Revisar evento: ${evento.titulo}`}
          variant="outline"
          className="h-10 border-wisen-borda text-[#30466E] hover:bg-wisen-admin-hover"
        >
          {reviewed ? "Ver revisão" : "Revisar evento"}
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}
