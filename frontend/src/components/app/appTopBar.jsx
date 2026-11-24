import { AdminZuzuTour } from "@/components/admin/adminZuzuTour";
import { BarraBusca } from "@/components/barraBusca";
import MenuPerfil from "@/components/homeCliente/menuPerfil";

export function AppTopBar({ admin = false, value, onQueryChange, belowProfile }) {
  const profileAccessory = admin ? <AdminZuzuTour /> : belowProfile;
  return (
    <header
      data-wisen-area={admin ? "admin" : "cliente"}
      className="fixed top-20 right-0 left-0 z-30 bg-white sm:top-0 sm:left-[76px] lg:left-[240px]"
    >
      <div className="wisen-container flex h-[76px] items-center justify-end gap-3">
        <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
          <BarraBusca admin={admin} value={value} onQueryChange={onQueryChange} />
        </div>
        <div className="relative shrink-0">
          <MenuPerfil profileHref={admin ? "/paginaPerfilAdm" : "/paginaPerfil"} />
          {profileAccessory && (
            <div className="absolute top-[calc(100%+1.5rem)] left-1/2 -translate-x-1/2">
              {profileAccessory}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
