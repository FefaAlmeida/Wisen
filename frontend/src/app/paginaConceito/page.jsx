
import Sidebar from "@/components/sidebar";

import CabecalhoConceito from "@/components/conceito/cabecalhoConceito";
import PainelAprendizado from "@/components/conceito/painelAprendizado";
import DefinicaoConceito from "@/components/conceito/definicaoConceito";
import AcoesConceito from "@/components/conceito/acoesConceito";
import NoticiasRelacionadas from "@/components/conceito/noticiasRelacionadas";

export default function PaginaConceito() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Meu conhecimento" />

      <main className="min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-8 pb-12 md:px-8">

          {/* Informações do conceito e aprendizado */}
          <div className="grid items-stretch gap-4 xl:grid-cols-[1.8fr_1fr]">
            <CabecalhoConceito />
            <PainelAprendizado />
          </div>

          {/* Definição e ações */}
          <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[1.8fr_1fr]">
            <DefinicaoConceito />
            <AcoesConceito />
          </div>

          {/* Notícias relacionadas */}
          <section className="mt-5">
            <NoticiasRelacionadas />
          </section>

        </div>
      </main>
    </div>
  );
}
