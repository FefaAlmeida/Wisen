import React from 'react';
import { ProfileHeader } from '@/components/profileHeader';
import { PersonalDataCard } from '@/components/personalDataCard';
import { InterestsCard } from '@/components/interestsCard';
import { NotificationsCard } from '@/components/notificationsCard';
import { SecurityCard } from '@/components/securityCard';

export default function PerfilPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 space-y-8 bg-slate-50/60 min-h-screen">
      {/* Cabeçalho */}
      <ProfileHeader />

      {/* Grid de Conteúdo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Dados Pessoais */}
        <PersonalDataCard />

        {/* Card 2: Interesses */}
        <InterestsCard />

        {/* Card 3: Notificações */}
        <NotificationsCard />

        {/* Card 4: Segurança da Conta */}
        <SecurityCard />
      </div>
    </div>
  );
}