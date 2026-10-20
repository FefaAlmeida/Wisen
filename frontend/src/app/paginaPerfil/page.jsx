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
      <main className="min-h-screen bg-slate-50/60 sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-6xl space-y-8 p-6 md:p-10">
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