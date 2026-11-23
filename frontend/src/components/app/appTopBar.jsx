import { BarraBusca } from "@/components/barraBusca";
import MenuPerfil from "@/components/homeCliente/menuPerfil";

export function AppTopBar({ admin = false, value, onQueryChange, hideLabel = false }) {
  return (
    <header
      data-wisen-area={admin ? "admin" : "cliente"}
      className="fixed top-20 right-0 left-0 z-30 bg-white sm:top-0 sm:left-[76px] lg:left-[240px]"
    >
      <div className="wisen-container flex h-[76px] items-center justify-end gap-3">
        {admin && !hideLabel && (
          <span className="mr-auto hidden text-xs font-medium text-wisen-texto-suave md:block">
            Administração
          </span>
        )}
        <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
          <BarraBusca value={value} onQueryChange={onQueryChange} />
        </div>
        <MenuPerfil profileHref={admin ? "/paginaPerfilAdm" : "/paginaPerfil"} />
      </div>
    </header>
  );
}
