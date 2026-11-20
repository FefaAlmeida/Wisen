import { AppTopBar } from "@/components/app/appTopBar";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
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
      <Sidebar activeItem="Aprendizado" />

      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <AppTopBar />

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
