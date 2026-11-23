import { AppTopBar } from "@/components/app/appTopBar";
import { PageHeader, PageIntro } from "@/components/app/pageHeader";
import { Footer } from "@/components/footer";
import PainelGuardados from "@/components/guardados/painelGuardados";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import Sidebar from "@/components/sidebar";

export default function PaginaGuardados() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Salvos" />

      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <AppTopBar />

          {/* Conteúdo principal */}
          <div className="wisen-container pt-7 pb-12">
            <PageHeader title="Meus" highlight="salvos" className="mb-7" />

            <PageIntro title="Notícias e conceitos salvos">
              Acesse os conteúdos que você salvou para ler ou revisar quando quiser.
            </PageIntro>

            {/* Abas e conteúdo */}
            <PainelGuardados />
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
