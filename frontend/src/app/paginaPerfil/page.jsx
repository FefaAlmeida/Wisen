import React from 'react';
import Sidebar from '@/components/sidebar';
import { ProfileHeader } from '@/components/perfil/profileHeader';
import { PersonalDataCard } from '@/components/perfil/personalDataCard';
import { InterestsCard } from '@/components/perfil/interestsCard';
import { NotificationsCard } from '@/components/perfil/notificationsCard';
import { SecurityCard } from '@/components/perfil/securityCard';

export default function PerfilPage() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Configurações" />
      <main className="min-h-screen bg-[#f1f3f6] sm:ml-[128px] lg:ml-[220px]">
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