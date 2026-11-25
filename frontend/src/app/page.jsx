import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import { ApresentacaoLanding } from "@/components/landingPage/apresentacaoLanding";
import { BannerImpacto } from "@/components/landingPage/bannerImpacto";
import { DepoimentosLanding } from "@/components/landingPage/depoimentosLanding";
import { HeroLanding } from "@/components/landingPage/heroLanding";
import { PerguntasFrequentes } from "@/components/landingPage/perguntasFrequentes";
import { PlanosLanding } from "@/components/landingPage/planosLanding";
import { RecursosLanding } from "@/components/landingPage/recursosLanding";

export default function PaginaLanding() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#EEF5FB] text-[#2B333F] selection:bg-[#E8E191] selection:text-[#101A40]">
      <ConnectionsBackground opacity={0.5} particleDensity={0.95} />
      <main className="relative z-10 flex w-full flex-col gap-24 md:gap-32 lg:gap-36">
        <HeroLanding />

        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[inherit] px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="relative -mx-[calc(50vw-50%)] w-screen px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="mx-auto max-w-[1360px]">
              <ApresentacaoLanding />
            </div>
          </div>
          <RecursosLanding />
          <BannerImpacto />
          <div className="relative -mx-[calc(50vw-50%)] w-screen px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="mx-auto max-w-[1360px]">
              <DepoimentosLanding />
            </div>
          </div>
          <PlanosLanding />
          <PerguntasFrequentes />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
