import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { imagensConceitos } from "@/data/imagensConceitos";
import BotaoRemoverSalvo from "./botaoRemoverSalvo";

export default function CardConceitoMarcado({ conceito, aoRemover }) {
  return (
    <Card
      role="article"
      className="relative flex-row items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-none transition-colors hover:border-[#BBC9DC] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-wisen-destaque sm:gap-3 sm:px-4"
    >
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-wisen-superficie sm:h-14 sm:w-24">
        <Image
          src={imagensConceitos[conceito.titulo]}
          alt=""
          fill
          sizes="(min-width: 640px) 96px, 64px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-wisen-titulo">
          <Link
            href="/paginaConceito"
            className="underline-offset-4 outline-none after:absolute after:inset-0 hover:text-wisen-destaque hover:underline focus-visible:underline"
          >
            {conceito.titulo}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-wisen-texto-suave">
          {conceito.descricao}
        </p>
      </div>

      <BotaoRemoverSalvo titulo={conceito.titulo} aoRemover={aoRemover} />
    </Card>
  );
}
