
import {
  ArrowRight,
  Layers,
  Network,
  Play,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroLanding() {
  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden rounded-[28px] border border-[#DCE4EC] bg-[#E9EEF4] shadow-[0_24px_65px_-42px_rgba(16,26,64,0.32)] sm:rounded-[32px]"
    >
      {/* Vídeo original */}
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[65%_center] opacity-60 sm:opacity-80 lg:opacity-100"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/download.mp4" type="video/mp4" />
      </video>

      {/* Gradientes para integrar vídeo e conteúdo */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#F1F3F6] via-[#F1F3F6]/95 to-[#F1F3F6]/55 lg:from-[#F1F3F6] lg:via-[#F1F3F6]/85 lg:to-transparent" />

      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#E9EEF4]/65 via-transparent to-white/10" />

      <div className="relative z-10 grid min-h-[590px] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-12 lg:gap-4 lg:px-14 lg:py-16">

        {/* Conteúdo */}
        <div className="relative z-20 space-y-7 lg:col-span-7">

          <span className="inline-flex max-w-full items-center rounded-full border border-[#CFD9E5] bg-white/65 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#526783] backdrop-blur-sm sm:text-[11px]">
            A inteligência para um Brasil e o mundo
          </span>

          <h1 className="max-w-[670px] text-[clamp(2.8rem,5.3vw,4.9rem)] font-bold leading-[1.08] tracking-[-0.06em] text-[#101A40]">
            Entenda o mundo.
            <br />
            Construa o{" "}
            <span className="relative inline-flex items-baseline">
              <span className="relative z-10">
                seu
              </span>

              <span className="absolute -bottom-1 left-0 right-5 h-[11px] -rotate-2 rounded-full bg-[#E8E191]/90 sm:h-[15px]" />

              <span className="relative z-10 ml-1.5 inline-block h-3 w-3 shrink-0 rounded-full bg-[#D9C54E] sm:h-4 sm:w-4" />
            </span>
          </h1>

          <p className="max-w-[465px] text-[15px] leading-[1.9] text-[#566579] sm:text-base">
            O Wisen transforma complexidade em aprendizado, com
            explicações claras, conexões personalizadas e o seu
            mundo completo ao seu alcance.
          </p>

          {/* Botões */}
          <div className="flex flex-wrap items-center gap-3 pt-2">

            <Button className="group h-12 cursor-pointer gap-3 rounded-xl bg-[#101A40] px-6 text-[13px] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(16,26,64,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#30466E] hover:shadow-[0_16px_28px_-12px_rgba(16,26,64,0.45)]">
              <span>Começar agora</span>
              <ArrowRight className="h-4 w-4 text-[#E8E191] transition-transform duration-300 group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              className="group h-12 cursor-pointer gap-3 rounded-xl border-[#D7DFE9] bg-white/80 px-5 text-[13px] font-semibold text-[#101A40] shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8E191]">
                <Play className="ml-0.5 h-3 w-3 fill-[#101A40] text-[#101A40]" />
              </div>

              <span>Ver como funciona</span>
            </Button>

          </div>
        </div>

      </div>
    </section>
  );
}
