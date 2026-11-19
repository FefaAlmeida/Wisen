import { BarraBusca } from "@/components/barraBusca";

import { Footer } from "@/components/footer";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";

export default function RevisoesLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />

      <main className="relative isolate min-h-screen min-w-0 bg-[#F0F4F8] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          {children}
        </div>
        <Footer variant="cliente" />
      </main>
    </div>
  );
}
