import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const estilosStatus = {
  "Em revisão": {
    badge: "bg-[#FFF7D9] text-[#B48C13]",
    icone: "bg-[#FFF4D8] text-[#D7A91F]",
  },
  Lacuna: {
    badge: "bg-[#FDEBED] text-[#E56470]",
    icone: "bg-[#FFF0F1] text-[#E56470]",
  },
  Dominado: {
    badge: "bg-[#E6F6ED] text-[#2C9C68]",
    icone: "bg-[#E4F5EC] text-[#2C9C68]",
  },
};

export default function CardConceitoMarcado({ conceito }) {
  const estilo = estilosStatus[conceito.status];

  return (
    <Card className="flex-row items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-none transition-colors hover:border-[#CDD8E8] sm:gap-3 sm:px-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${estilo.icone}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden="true"
        >
          <path d={conceito.icone} />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-wisen-titulo">
          <Link href="/paginaConceito">{conceito.titulo}</Link>
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-wisen-texto-suave">
          {conceito.descricao}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge
          className={`hidden rounded-full border-0 px-2 py-0.5 text-[11px] shadow-none sm:inline-flex ${estilo.badge}`}
        >
          {conceito.status}
        </Badge>

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 text-[#344469]"
          aria-label="Conceito marcado"
        >
          <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-4-6 4V3.5Z" />
        </svg>
      </div>
    </Card>
  );
}
