import React from 'react';
import { BannerInicioAdm } from '@/components/inicioAdm/bannerInicioAdm';
import { CartoesMetricasAdm } from '@/components/inicioAdm/cartoesMetricasAdm';
import { GraficosAtividadeAdm } from '@/components/inicioAdm/graficosAtividadeAdm';
import { TabelasDesempenhoAdm } from '@/components/inicioAdm/tabelasDesempenhoAdm';

export default function PaginaInicioAdm() {
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-[#2B333F] selection:bg-[#E8E191] p-6 md:p-10 space-y-8">
      
      {/* Etapa 1: Banner do Topo */}
      <BannerInicioAdm />

      {/* Etapa 2: Cartões de Métricas */}
      <CartoesMetricasAdm />

      {/* Etapa 3: Gráficos e Atividade Recente */}
      <GraficosAtividadeAdm />

      {/* Etapa 4: Tabelas de Desempenho e Lacunas */}
      <TabelasDesempenhoAdm />

    </div>
  );
}