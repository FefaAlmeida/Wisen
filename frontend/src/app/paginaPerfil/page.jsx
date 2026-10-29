import { InterestsCard } from "@/components/perfil/interestsCard";
import { NotificationsCard } from "@/components/perfil/notificationsCard";
import { PersonalDataCard } from "@/components/perfil/personalDataCard";
import { ProfileHeader } from "@/components/perfil/profileHeader";
import { SecurityCard } from "@/components/perfil/securityCard";
import Sidebar from "@/components/sidebar";

export default function PerfilPage() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />
      <main className="min-h-screen bg-wisen-superficie sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <ProfileHeader />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <PersonalDataCard />

            <InterestsCard />

            <NotificationsCard />

            <SecurityCard />
          </div>
        </div>
      </main>
    </div>
  );
}
