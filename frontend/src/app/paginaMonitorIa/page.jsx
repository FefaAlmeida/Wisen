import React from 'react';
import { TopoMonitorIa } from '@/components/monitorIa/topoMonitorIa';
import { CartoesMetricasIa } from '@/components/monitorIa/cartoesMetricasIa';
import { GraficosConsumoIa } from '@/components/monitorIa/graficosConsumoIa';
import { TabelaLogsIa } from '@/components/monitorIa/tabelaLogsIa';
import { Footer } from "@/components/footer";

export default function PaginaMonitorIa() {
  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-[#2B333F] selection:bg-[#E8E191] p-6 md:p-10 space-y-8">
      
      {/* Etapa 1: Topo do Monitor */}
      <TopoMonitorIa />

      {/* Etapa 2: Cartões de Métricas e Orçamento */}
      <CartoesMetricasIa />

      {/* Etapa 3: Gráficos de Consumo e Distribuição de Custos */}
      <GraficosConsumoIa />

      {/* Etapa 4: Tabela de Logs de Chamadas de IA */}
      <TabelaLogsIa />
      <Footer />
    </div>

  );
}