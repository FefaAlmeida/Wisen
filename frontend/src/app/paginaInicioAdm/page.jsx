import { AdminLayout } from "@/components/admin/adminLayout";
import { BannerInicioAdm } from "@/components/inicioAdm/bannerInicioAdm";
import { CartoesMetricasAdm } from "@/components/inicioAdm/cartoesMetricasAdm";
import { GraficosAtividadeAdm } from "@/components/inicioAdm/graficosAtividadeAdm";
import { TabelasDesempenhoAdm } from "@/components/inicioAdm/tabelasDesempenhoAdm";

export default function PaginaInicioAdm() {
  return (
    <AdminLayout activeItem="Visão geral">
      <div className="min-h-screen space-y-8 bg-slate-50/60 p-6 font-[family-name:var(--font-geist-sans)] text-[#2B333F] selection:bg-[#EBDD80] md:p-10">
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
