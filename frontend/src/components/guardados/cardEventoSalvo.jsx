import { ArrowUpRight, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const coresCategoria = {
  "Meio ambiente": "bg-[#E8F4EC] text-[#28583D]",
  Política: "bg-[#EAF0FC] text-[#354F83]",
  Economia: "bg-[#FBF1D7] text-[#725318]",
};

export default function CardEventoSalvo({ evento }) {
  return (
    <Card
      role="article"
      className="group/evento relative grid grid-cols-[64px_minmax(0,1fr)_24px] items-center gap-2 rounded-xl bg-white p-2 transition-[border-color,box-shadow] hover:border-[#BBC9DC] hover:shadow-sm has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-wisen-destaque sm:grid-cols-[112px_minmax(0,1fr)_28px] sm:gap-3 sm:px-3"
    >
      <div className="relative h-16 overflow-hidden rounded-lg bg-wisen-superficie sm:h-18">
        <Image
          src={evento.imagem}
          fill
          alt=""
          sizes="(min-width: 640px) 112px, 64px"
          className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/evento:scale-105"
        />
      </div>

      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Badge
            className={`h-auto px-2 py-0 text-[11px] leading-4 font-semibold ${coresCategoria[evento.categoria] ?? "bg-wisen-superficie text-wisen-texto-forte"}`}
          >
            {evento.categoria}
          </Badge>
          <span className="text-xs text-wisen-texto-suave">{evento.data}</span>
          <Bookmark
            className="size-3.5 shrink-0 fill-current text-wisen-texto-forte"
            role="img"
            aria-label="Evento salvo"
          />
        </div>

        <h3 className="text-sm leading-snug font-semibold text-wisen-titulo">
          <Link
            href="/paginaEvento"
            className="outline-none after:absolute after:inset-0 group-hover/evento:underline group-hover/evento:underline-offset-4"
          >
            {evento.titulo}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-4 text-wisen-texto-suave">
          {evento.descricao}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="grid size-6 place-items-center justify-self-center rounded-full border border-wisen-borda bg-wisen-superficie text-wisen-texto-forte transition-colors group-hover/evento:border-wisen-destaque-suave group-hover/evento:bg-wisen-cliente-hover group-focus-within/evento:bg-wisen-cliente-hover sm:size-7"
      >
        <ArrowUpRight className="size-3.5" />
      </span>
    </Card>
  );
}
