import { BarraBusca } from "@/components/barraBusca";
import AcoesConceito from "@/components/conceito/acoesConceito";
import CabecalhoConceito from "@/components/conceito/cabecalhoConceito";
import DefinicaoConceito from "@/components/conceito/definicaoConceito";
import NoticiasRelacionadas from "@/components/conceito/noticiasRelacionadas";
import PainelAprendizado from "@/components/conceito/painelAprendizado";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";

export default function PaginaConceito() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Meu conhecimento" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          <div className="px-5 pt-8 pb-12 md:px-8">
            <div className="grid items-stretch gap-4 xl:grid-cols-[1.8fr_1fr]">
              <CabecalhoConceito />
              <PainelAprendizado />
            </div>

            <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[1.8fr_1fr]">
              <DefinicaoConceito />
              <AcoesConceito />
            </div>

            <section className="mt-5">
              <NoticiasRelacionadas />
            </section>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
