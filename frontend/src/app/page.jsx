import { ApresentacaoLanding } from "@/components/landingPage/apresentacaoLanding";
import { BannerImpacto } from "@/components/landingPage/bannerImpacto";
import { DepoimentosLanding } from "@/components/landingPage/depoimentosLanding";
import { HeroLanding } from "@/components/landingPage/heroLanding";
import { PerguntasFrequentes } from "@/components/landingPage/perguntasFrequentes";
import { RecursosLanding } from "@/components/landingPage/recursosLanding";

export default function PaginaLanding() {
  return (
    <div className="min-h-screen bg-[#F1F3F6] text-[#2B333F] selection:bg-[#E8E191] selection:text-[#2B333F]">
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-20">
        <HeroLanding />

        <ApresentacaoLanding />

        <RecursosLanding />

        <BannerImpacto />

        <DepoimentosLanding />

        <PerguntasFrequentes />
      </main>

      
    </div>
  );
}
