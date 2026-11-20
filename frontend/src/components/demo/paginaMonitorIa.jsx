import { AdminLayout } from "@/components/admin/adminLayout";
import { CartoesMetricasIa } from "@/components/monitorIa/cartoesMetricasIa";
import { GraficosConsumoIa } from "@/components/monitorIa/graficosConsumoIa";
import { TabelaLogsIa } from "@/components/monitorIa/tabelaLogsIa";
import { TopoMonitorIa } from "@/components/monitorIa/topoMonitorIa";

export default function PaginaMonitorIa() {
  return (
    <AdminLayout activeItem="Monitor de IA">
      <div className="mx-auto min-h-screen w-full min-w-0 max-w-[1600px] space-y-7 bg-transparent px-4 pt-7 pb-12 sm:px-5 lg:px-7 font-[family-name:var(--font-geist-sans)] text-[#2B333F] selection:bg-[#EBDD80]">
        {/* Etapa 1: Topo do Monitor */}
        <TopoMonitorIa />

        {/* Etapa 2: Cartões de Métricas e Orçamento */}
        <CartoesMetricasIa />

        {/* Etapa 3: Gráficos de Consumo e Distribuição de Custos */}
        <GraficosConsumoIa />

        {/* Etapa 4: Tabela de Logs de Chamadas de IA */}
        <TabelaLogsIa />
      </div>
    </AdminLayout>
  );
}
