import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function IconeMarcador() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-4-6 4V3.5Z" />
    </svg>
  );
}

export default function CardEventoSalvo({ evento }) {
  return (
    <Card className="flex-row items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-none transition-colors hover:border-[#CDD8E8]">
      <Image
        src={evento.imagem}
        width={120}
        height={85}
        alt=""
        sizes="(max-width: 640px) 108px, 120px"
        className="h-[85px] w-[108px] shrink-0 rounded-lg object-cover sm:w-[120px]"
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <Badge className="rounded-md border-0 bg-[#EEF3FA] px-2 py-0.5 text-[10px] font-medium text-[#607398] shadow-none">
            {evento.categoria}
          </Badge>
          <span className="text-[10px] text-[#97A5BB]">{evento.data}</span>
        </div>

        <h3 className="text-[13px] leading-[17px] font-semibold text-wisen-titulo">
          {evento.titulo}
        </h3>

        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#8392AD]">{evento.descricao}</p>
      </div>

      <div className="flex shrink-0 items-start self-start gap-2 pt-1 text-[#344469]">
        <span title="Evento salvo">
          <IconeMarcador />
        </span>
        <span aria-hidden="true" className="text-lg leading-none">
          ···
        </span>
      </div>
    </Card>
  );
}
