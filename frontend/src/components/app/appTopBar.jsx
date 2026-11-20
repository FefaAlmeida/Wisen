import { BarraBusca } from "@/components/barraBusca";
import MenuPerfil from "@/components/homeCliente/menuPerfil";

export function AppTopBar({ admin = false, value, onQueryChange }) {
  return (
    <header
      data-wisen-area={admin ? "admin" : "cliente"}
      className="fixed top-20 right-0 left-0 z-30 border-b border-wisen-borda/70 bg-wisen-superficie/95 backdrop-blur-md sm:top-0 sm:left-[76px] lg:left-[240px]"
    >
      <div className="wisen-container flex h-[76px] items-center justify-end gap-3">
        <span className="mr-auto hidden text-xs font-medium text-wisen-texto-suave md:block">
          {admin ? "Administração" : "Seu espaço de aprendizado"}
        </span>
        <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
          <BarraBusca value={value} onQueryChange={onQueryChange} />
        </div>
        <MenuPerfil profileHref={admin ? "/paginaPerfilAdm" : "/paginaPerfil"} />
      </div>
    </header>
  );
}
