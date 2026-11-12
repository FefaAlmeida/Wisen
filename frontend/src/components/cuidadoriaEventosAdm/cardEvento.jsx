import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const estilosStatus = {
  Pendente: "bg-[#FBF2CC] text-[#7A6418]",
  Revisado: "bg-[#E5F4EA] text-[#2E8556]",
  Ajustado: "bg-[#E7EEFB] text-[#3B70C1]",
};

export default function CardEvento({
  evento,
  selecionado,
  aoSelecionar,
  aoVerArtigos,
  aoEditar,
  ativo,
}) {
  return (
    <Card
      className={`rounded-lg border px-4 py-3 shadow-none transition-all ${
        selecionado
          ? "border-[#E4C95D] bg-[#FFFDF5]"
          : ativo
            ? "border-[#D6E0EE] bg-[#FAFCFF]"
            : "border-[#E5EAF2] bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="pt-0.5">
          <Checkbox
            checked={selecionado}
            onCheckedChange={(valor) => aoSelecionar(evento.id, valor === true)}
            aria-label={`Selecionar ${evento.titulo}`}
            className="border-[#C7D3E5] data-[state=checked]:border-[#E0C43F] data-[state=checked]:bg-[#E0C43F] data-[state=checked]:text-[#101A40]"
          />
        </div>

        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg bg-[#EDF2F8]">
          {evento.imagem && (
            <img src={evento.imagem} alt={evento.titulo} className="h-full w-full object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-6 text-[#101A40]">{evento.titulo}</h3>

          <p className="mt-1 max-h-[44px] overflow-hidden text-sm leading-5 text-[#6E809F]">
            {evento.descricao}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full border-0 bg-[#EEF3FB] px-3 py-1 text-xs font-medium text-[#5B6F93] shadow-none">
              {evento.categoria}
            </Badge>

            <span className="text-xs text-[#90A0BA]">
              · Identificado {evento.identificacao}
            </span>

            <span className="text-xs text-[#90A0BA]">· {evento.data}</span>
          </div>
        </div>

        <div className="hidden w-[120px] shrink-0 xl:block">
          <div className="flex items-center gap-2 text-sm text-[#30466E]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-[#60789F]"
              aria-hidden="true"
            >
              <path d="M8 7h8" />
              <path d="M8 12h8" />
              <path d="M8 17h5" />
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>

            <span>{evento.artigos.length} artigos</span>
          </div>

          <Badge
            className={`mt-3 rounded-full border-0 px-3 py-1 text-xs font-medium shadow-none ${estilosStatus[evento.status]}`}
          >
            {evento.status}
          </Badge>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => aoVerArtigos(evento)}
            className="h-11 rounded-lg border-[#E2E8F2] bg-[#F3F6FB] px-4 text-sm font-medium text-[#30466E] shadow-none transition-colors hover:bg-[#FBF7E5]"
          >
            Ver artigos
            <span className="ml-2 text-base">→</span>
          </Button>

          <button
            type="button"
            onClick={() => aoEditar(evento)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#597196] transition-colors hover:bg-[#EBDD80]"
            aria-label={`Editar ${evento.titulo}`}
            title="Editar evento"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
}
