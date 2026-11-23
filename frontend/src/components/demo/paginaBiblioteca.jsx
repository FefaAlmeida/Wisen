import { Suspense } from "react";
import { AppTopBar } from "@/components/app/appTopBar";
import { PageHeader, PageIntro } from "@/components/app/pageHeader";

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

            <PageIntro title="Os conceitos por trás das notícias">
              Consulte os conceitos que aparecem nos artigos e veja seu nível de conhecimento em
              cada um.
            </PageIntro>

            {/* Filtros e catálogo de conceitos */}
            <Suspense fallback={<p>Carregando conceitos…</p>}>
              <CatalogoConceitos />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer variant="cliente" />
    </div>
  );
}
