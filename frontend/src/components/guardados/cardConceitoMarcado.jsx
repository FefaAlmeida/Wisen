
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
    <Card className="flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3 py-3 shadow-none transition-colors hover:border-[#CDD8E8]">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${estilo.icone}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d={conceito.icone} />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[13px] font-semibold text-[#101A40]">
          {conceito.titulo}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#8A99B3]">
          {conceito.descricao}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge className={`hidden rounded-full border-0 px-2 py-1 text-[10px] shadow-none sm:inline-flex ${estilo.badge}`}>
          {conceito.status}
        </Badge>

        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-[#344469]"
          aria-label="Conceito marcado"
        >
          <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-4-6 4V3.5Z" />
        </svg>

        <span className="text-[#344469]" aria-hidden="true">
          ···
        </span>
      </div>
    </Card>
  );
}
