import Link from "next/link";
import { Footer } from "@/components/footer";
import { ApresentacaoLanding } from "@/components/landingPage/apresentacaoLanding";
import { BannerImpacto } from "@/components/landingPage/bannerImpacto";
import { DepoimentosLanding } from "@/components/landingPage/depoimentosLanding";
import { HeroLanding } from "@/components/landingPage/heroLanding";
import { PerguntasFrequentes } from "@/components/landingPage/perguntasFrequentes";
import { RecursosLanding } from "@/components/landingPage/recursosLanding";

export default function PaginaLanding() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#F1F3F6] text-[#2B333F] selection:bg-[#E8E191] selection:text-[#101A40]">
      <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-20 px-4 pb-24 pt-5 sm:px-6 sm:pt-8 md:gap-28 lg:gap-32 lg:px-10 xl:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-black text-[#101A40]">
            Wisen<span className="text-[#D9C54E]">•</span>
          </Link>
          <nav
            aria-label="Navegação da plataforma"
            className="flex flex-wrap items-center gap-3 text-sm font-semibold sm:gap-5"
          >
            <Link href="/paginaLogin" className="rounded-md px-2 py-2 hover:underline">
              Entrar
            </Link>
            <Link href="/paginaCadastro" className="rounded-md px-2 py-2 hover:underline">
              Criar conta
            </Link>
            <Link
              href="/paginaInicialCliente"
              className="rounded-xl bg-[#101A40] px-4 py-2 text-white hover:bg-[#30466E]"
            >
              Acessar plataforma
            </Link>
          </nav>
        </header>
        <HeroLanding />
        <ApresentacaoLanding />
        <RecursosLanding />
        <BannerImpacto />
        <DepoimentosLanding />
        <PerguntasFrequentes />
      </main>

      <Footer />
    </div>
  );
}
