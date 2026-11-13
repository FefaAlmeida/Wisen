import { BarraBusca } from "@/components/barraBusca";
import { Footer } from "@/components/footer";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { CabecalhoConhecimento } from "@/components/meuConhecimento/cabecalhoConhecimento";
import { CartaoFocoAtual } from "@/components/meuConhecimento/cartaoFocoAtual";
import { CartoesEstatisticas } from "@/components/meuConhecimento/cartoesEstatisticas";
import styles from "@/components/meuConhecimento/conhecimento.module.css";
import { DistribuicaoCategorias } from "@/components/meuConhecimento/distribuicaoCategorias";
import { GraficoEvolucao } from "@/components/meuConhecimento/graficoEvolucao";
import { HistoricoAtividades } from "@/components/meuConhecimento/historicoAtividades";
import Sidebar from "@/components/sidebar";

export default function PaginaConhecimento() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Meu conhecimento" />

      <main className="relative isolate min-h-screen min-w-0 bg-[#F0F4F8] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          <div className={styles.page}>
            <CabecalhoConhecimento />
            <CartoesEstatisticas />
            <div className={styles.grid}>
              <GraficoEvolucao />
              <DistribuicaoCategorias />
              <HistoricoAtividades />
              <CartaoFocoAtual />
            </div>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
