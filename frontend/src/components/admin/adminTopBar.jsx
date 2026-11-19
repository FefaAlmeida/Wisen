import { BarraBusca } from "@/components/barraBusca";
import MenuPerfil from "@/components/homeCliente/menuPerfil";

export function AdminTopBar() {
  return (
    <header className="fixed top-20 right-0 left-0 z-30 bg-[#F0F4F9]/90 backdrop-blur-sm sm:top-0 sm:left-[128px] lg:left-[220px]">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-end gap-3 px-4 py-3 sm:px-5 lg:px-7">
        <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
          <BarraBusca />
        </div>
        <MenuPerfil profileHref="/paginaPerfilAdm" />
      </div>
    </header>
  );
}
