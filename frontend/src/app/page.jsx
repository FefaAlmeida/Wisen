import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import { ApresentacaoLanding } from "@/components/landingPage/apresentacaoLanding";
import { BannerImpacto } from "@/components/landingPage/bannerImpacto";
import { DepoimentosLanding } from "@/components/landingPage/depoimentosLanding";
import { HeroLanding } from "@/components/landingPage/heroLanding";
import { PerguntasFrequentes } from "@/components/landingPage/perguntasFrequentes";
import { RecursosLanding } from "@/components/landingPage/recursosLanding";

export default function PaginaLanding() {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[#F1F3F6] text-[#2B333F] selection:bg-[#E8E191] selection:text-[#101A40]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ConnectionsBackground fadeTop={false} fullSpread particleDensity={0.3} />
      </div>
      <main className="relative z-10 w-full">
        <HeroLanding />

        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-24 px-4 pb-0 pt-28 sm:px-6 sm:pt-32 md:gap-32 lg:gap-36 lg:px-10 xl:px-12">
          <ApresentacaoLanding />
          <div
            aria-hidden="true"
            className="-my-12 h-px w-screen -mx-[calc(50vw-50%)] bg-[#30466E]/45 shadow-[0_1px_5px_rgba(16,26,64,0.18)] md:-my-16 lg:-my-[72px]"
          />
          <RecursosLanding />
          <BannerImpacto />
          <DepoimentosLanding />
          <PerguntasFrequentes />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
