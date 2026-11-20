import { AppTopBar } from "@/components/app/appTopBar";
import { PageHeader } from "@/components/app/pageHeader";

import { CatalogoConceitos } from "@/components/biblioteca/catalogoConceitos";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Conceitos" />

      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <AppTopBar />

          {/* Conteúdo principal */}
          <div className="wisen-container pt-7 pb-12">
            {/* Apresentação da biblioteca */}
            <PageHeader
              eyebrow="Conceitos"
              title="Biblioteca de"
              highlight="conceitos."
              className="mb-7"
            />

            <section className="wisen-panel mb-7 p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-wisen-titulo">Conecte ideias</h2>
              <span aria-hidden="true" className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
              <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
                Descubra as ideias por trás das notícias e acompanhe seu progresso em cada tema.
              </p>
            </section>

            {/* Filtros e catálogo de conceitos */}
            <CatalogoConceitos />
          </div>
        </div>
      </main>

      <Footer variant="cliente" />
    </div>
  );
}
