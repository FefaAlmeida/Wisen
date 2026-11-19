import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function CardInteresse({ imagem, titulo, porcentagem, icone: Icon, cor }) {
  return (
    <Card className="group relative isolate h-full min-h-[240px] overflow-hidden rounded-2xl border border-white/20 bg-[#101A40] p-0 shadow-[0_12px_30px_-18px_rgba(16,26,64,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-16px_rgba(16,26,64,0.5)]">
      <div className="absolute inset-0">
        <Image
          src={imagem}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#101A40]/95 via-[#101A40]/40 to-[#101A40]/10" />

      <CardContent className="relative flex min-h-[240px] flex-col justify-between gap-0 px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/15 shadow-lg backdrop-blur-md"
            style={{ color: cor }}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span
            className="rounded-full border border-white/25 bg-[#101A40]/35 px-3 py-1.5 text-sm font-semibold backdrop-blur-md"
            style={{ color: cor }}
          >
            {porcentagem}%
          </span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-lg leading-tight font-semibold text-white sm:text-xl">
            {titulo}
          </h3>
          <p className="mt-1 text-xs text-white/75 sm:text-sm">das suas leituras</p>

          <div
            role="progressbar"
            aria-label={`Participação de ${titulo} nas leituras`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={porcentagem}
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/25"
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${porcentagem}%`, backgroundColor: cor }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
