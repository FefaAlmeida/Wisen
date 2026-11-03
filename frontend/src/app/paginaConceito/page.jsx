
import { Search } from "lucide-react";

import AcoesConceito from "@/components/conceito/acoesConceito";
import CabecalhoConceito from "@/components/conceito/cabecalhoConceito";
import DefinicaoConceito from "@/components/conceito/definicaoConceito";
import NoticiasRelacionadas from "@/components/conceito/noticiasRelacionadas";
import PainelAprendizado from "@/components/conceito/painelAprendizado";

import Sidebar from "@/components/sidebar";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { Input } from "@/components/ui/input";

export default function PaginaConceito() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Meu conhecimento" />

      <main className="min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px]">

          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">

            <search className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
                size={16}
              />

              <Input
                type="search"
                aria-label="Buscar notícias, conceitos ou temas"
                placeholder="Pesquise por notícias, conceitos ou temas..."
                className="h-9 rounded-full border-wisen-borda bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
              />
            </search>

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
    </div>
  );
}
