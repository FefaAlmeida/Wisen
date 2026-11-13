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
      <main className="w-full">
        <HeroLanding />

        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-20 px-4 pb-0 pt-5 sm:px-6 sm:pt-8 md:gap-28 lg:gap-32 lg:px-10 xl:px-12">
          <ApresentacaoLanding />
          <RecursosLanding />
          <BannerImpacto />
          <DepoimentosLanding />
          <PerguntasFrequentes />
        </div>

        <div className="h-10 bg-[#F1F3F6] md:h-20" />
      </main>

      <Footer />
    </div>
  );
}
