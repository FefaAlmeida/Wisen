import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export function HeroLanding() {
  return (
    <section id="inicio" className="relative isolate w-full overflow-hidden bg-[#101A40]">
      <video
        className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.05] object-cover object-center brightness-105 contrast-105"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
        aria-hidden="true"
      >
        <source src="/globo_video.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,225,145,0.16),transparent_22%),radial-gradient(circle_at_center,_rgba(16,26,64,0.12),transparent_45%),linear-gradient(180deg,rgba(7,13,31,0.38)_0%,rgba(7,13,31,0.24)_25%,rgba(7,13,31,0.48)_55%,rgba(7,13,31,0.74)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(7,13,31,0.65)_0%,rgba(7,13,31,0.35)_48%,rgba(7,13,31,0.12)_100%)]" />

      <header className="absolute inset-x-0 top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 rounded-3xl md:flex-nowrap md:rounded-full border border-white/20 bg-white/5 px-4 py-3 shadow-[0_12px_26px_-18px_rgba(7,13,31,0.75)] backdrop-blur-md sm:px-5 lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
          >
            <span className="text-[1.7rem] font-black leading-none tracking-[-0.08em] text-white sm:text-[1.9rem]">
              Wisen
            </span>
            <span className="text-[1.4rem] font-black leading-none tracking-[-0.08em] text-[#E8E191] sm:text-[1.6rem]">
              •
            </span>
          </Link>

          <nav
            aria-label="Navegação da plataforma"
            className="flex w-full flex-wrap items-center justify-between gap-1 md:w-auto md:gap-2"
          >
            <Link
              href="/paginaLogin"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/paginaCadastro"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Criar conta
            </Link>
            <Link
              href="/paginaInicialCliente"
              className="rounded-full bg-[#E8E191] px-4 py-2 text-sm font-semibold text-[#101A40] shadow-[0_12px_20px_-12px_rgba(232,225,145,0.9)] transition-all duration-200 hover:bg-[#F3EB9B]"
            >
              Acessar plataforma
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 flex min-h-svh items-center px-4 pb-16 pt-48 sm:px-6 sm:pb-20 sm:pt-44 lg:min-h-[max(640px,100svh)] lg:px-8 lg:pb-24 lg:pt-40 xl:px-12">
        <div className="mx-auto grid w-full max-w-[1320px] items-end gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 space-y-6 lg:col-span-8 lg:space-y-8">
            <span className="inline-flex max-w-full items-center rounded-full border border-[#E8E191]/50 bg-[#101A40]/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#F4F6FA] backdrop-blur-sm sm:text-[11px]">
              A inteligência para um Brasil e o mundo
            </span>

            <h1 className="text-[clamp(2.5rem,8.5vw,6.5rem)] font-bold leading-[1.02] tracking-[-0.06em] text-white lg:text-[clamp(3.75rem,5.6vw,6.5rem)]">
              <span className="block">Entenda o mundo.</span>
              <span className="block">
                Construa o{" "}
                <span className="relative text-[#D9C54E]">
                  <span className="relative z-10">seu</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[0.06em] left-0 right-0 h-[0.14em] bg-[#E8E191]"
                  />
                  <span className="relative text-transparent">
                    .
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[0.12em] right-0 h-3 w-3 rounded-full bg-[#D9C54E] sm:h-4 sm:w-4"
                    />
                  </span>
                </span>
              </span>
            </h1>
          </div>

          <div className="flex w-full max-w-[480px] flex-col items-start gap-8 lg:col-span-4 lg:pb-1">
            <p className="max-w-[384px] text-lg leading-[1.6] text-[#E9EEF7] xl:text-xl">
              O Wisen transforma complexidade em aprendizado, com explicações claras, conexões
              personalizadas e o seu mundo completo ao seu alcance.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/paginaCadastro"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#E8E191] px-5 text-sm font-semibold text-[#101A40] shadow-[0_12px_26px_-12px_rgba(232,225,145,0.9)] transition-colors duration-200 hover:bg-[#F3EB9B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
              >
                <span>Começar agora</span>
                <ArrowRight className="h-4 w-4 text-[#101A40] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#sobre"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8E191]">
                  <Play className="ml-0.5 h-3 w-3 fill-[#101A40] text-[#101A40]" />
                </div>
                <span>Ver como funciona</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
