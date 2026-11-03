
import { Search } from "lucide-react";

import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";

import Sidebar from "@/components/sidebar";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { Input } from "@/components/ui/input";

export default function PerfilPage() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />

      <main className="min-h-screen min-w-0 bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px]">

          <div className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">

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

          <div className="space-y-8 px-4 pb-12 pt-8 sm:px-5 lg:px-7">

            <ProfileHeader />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <PersonalDataCard />

              <InterestsCard />

              <NotificationsCard />

              <SecurityCard />

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
