import { AppTopBar } from "@/components/app/appTopBar";
import { PageHeader } from "@/components/app/pageHeader";
import { Footer } from "@/components/footer";
import PainelGuardados from "@/components/guardados/painelGuardados";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import Sidebar from "@/components/sidebar";

export default function PaginaGuardados() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Guardados" />

      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <AppTopBar />

          {/* Conteúdo principal */}
          <div className="wisen-container pt-7 pb-12">
            {/* Cabeçalho */}
            <section className="relative mb-5 flex min-h-[190px] flex-wrap items-center justify-between gap-5 overflow-hidden">
              {/* Título e descrição */}
              <div className="relative z-10 max-w-[520px]">
                <PageHeader
                  eyebrow="Guardados"
                  title="Meus guardados"
                  description="Organize os conteúdos que você quer revisar depois."
                />
              </div>

              {/* Card informativo */}
              <div className="relative z-10 flex w-full max-w-[380px] items-start gap-4 rounded-xl bg-white/85 p-6 shadow-sm">
                <span className="text-[32px] text-[#EAC342]">✦</span>

                <div>
                  <h2 className="text-[17px] font-semibold text-wisen-titulo">
                    Seus guardados ficam aqui
                  </h2>

                  <p className="mt-2 text-[14px] leading-5 text-[#8A99B3]">
                    Salve notícias e conceitos para acessar quando quiser e continuar seu
                    aprendizado.
                  </p>
                </div>
              </div>
            </section>

            {/* Abas e conteúdo */}
            <PainelGuardados />
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
