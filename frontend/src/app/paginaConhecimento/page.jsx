import { Footer } from "@/components/footer";
import { BarraBusca } from "@/components/barraBusca";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { CabecalhoConhecimento } from "@/components/meuConhecimento/cabecalhoConhecimento";
import { CartaoFocoAtual } from "@/components/meuConhecimento/cartaoFocoAtual";
import { CartoesEstatisticas } from "@/components/meuConhecimento/cartoesEstatisticas";
import { DistribuicaoCategorias } from "@/components/meuConhecimento/distribuicaoCategorias";
import { GraficoEvolucao } from "@/components/meuConhecimento/graficoEvolucao";
import { HistoricoAtividades } from "@/components/meuConhecimento/historicoAtividades";
import Sidebar from "@/components/sidebar";

export default function PaginaConhecimento() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Meu conhecimento" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          {/* Conteúdo principal */}
          <div className="space-y-8 px-5 pt-8 pb-12 md:px-8">
            {/* Cabeçalho */}
            <CabecalhoConhecimento />

            {/* Cartões de estatísticas */}
            <CartoesEstatisticas />

            {/* Área principal: gráfico, histórico e categorias */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Coluna principal - 2/3 */}
              <div className="space-y-6 lg:col-span-2">
                {/* Gráfico de evolução */}
                <GraficoEvolucao />

                {/* Histórico recente de atividades */}
                <HistoricoAtividades />
              </div>

              {/* Coluna lateral - 1/3 */}
              <div className="space-y-6">
                {/* Distribuição por categoria */}
                <DistribuicaoCategorias />

                {/* Foco atual */}
                <CartaoFocoAtual />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
