import Image from "next/image";
import Link from "@/components/demo/link";
import { Card } from "@/components/ui/card";
import BotaoRemoverSalvo from "./botaoRemoverSalvo";

export default function CardEventoSalvo({ evento, aoRemover }) {
  return (
    <Card
      role="article"
      className="relative grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl bg-card px-3 py-4 shadow-none transition-colors hover:border-[#BBC9DC] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-wisen-destaque sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:gap-3 sm:px-4 sm:py-5"
    >
      <div className="relative h-16 overflow-hidden rounded-lg bg-wisen-superficie sm:h-18">
        <Image
          src={evento.imagem}
          fill
          alt=""
          sizes="(min-width: 640px) 112px, 64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <h3 className="text-sm leading-snug font-semibold text-wisen-titulo sm:text-base sm:leading-snug">
          <Link
            href={evento.href ?? "/paginaEvento"}
            className="underline-offset-4 outline-none after:absolute after:inset-0 hover:text-wisen-destaque hover:underline focus-visible:underline"
          >
            {evento.titulo}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-4 text-wisen-texto-suave">
          {evento.descricao}
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-wisen-texto-suave">
          <span>{evento.categoria}</span>
          <span aria-hidden="true">·</span>
          <span>{evento.data}</span>
        </div>
      </div>

      <BotaoRemoverSalvo titulo={evento.titulo} aoRemover={aoRemover} />
    </Card>
  );
}
