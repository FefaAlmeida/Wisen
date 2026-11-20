import { AdminLayout } from "@/components/admin/adminLayout";
import { BannerInicioAdm } from "@/components/inicioAdm/bannerInicioAdm";
import { CartoesMetricasAdm } from "@/components/inicioAdm/cartoesMetricasAdm";
import { GraficosAtividadeAdm } from "@/components/inicioAdm/graficosAtividadeAdm";
import { TabelasDesempenhoAdm } from "@/components/inicioAdm/tabelasDesempenhoAdm";

export default function PaginaInicioAdm() {
  return (
    <AdminLayout activeItem="Visão geral">
      <div className="wisen-container min-h-screen min-w-0 space-y-7 pt-7 pb-12 font-[family-name:var(--font-geist-sans)] text-wisen-titulo selection:bg-[#EBDD80]">
        {/* Etapa 1: Banner do Topo */}
        <BannerInicioAdm />

        {/* Etapa 2: Cartões de Métricas */}
        <CartoesMetricasAdm />

        {/* Etapa 3: Gráficos e Atividade Recente */}
        <GraficosAtividadeAdm />

        {/* Etapa 4: Tabelas de Desempenho e Lacunas */}
        <TabelasDesempenhoAdm />
      </div>
    </AdminLayout>
  );
}
