import { BarraBusca } from "@/components/barraBusca";
import DicaEstudo from "@/components/centralRevisao/dicaEstudo";
import QuizRevisao from "@/components/centralRevisao/quizRevisao";
import ResumoRevisoes from "@/components/centralRevisao/resumoRevisoes";
import SessaoHoje from "@/components/centralRevisao/sessaoHoje";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";

export default function PaginaRevisoes() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground fadeTop={false} />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca />
            </div>

            <MenuPerfil />
          </div>

          {/* Conteúdo principal */}
          <div className="px-5 pt-10 pb-12 md:px-8">
            {/* Apresentação */}
            <header className="mb-6">
              <p className="mb-5 text-[11px] font-semibold tracking-[0.25em] text-[#93A3BE]">
                BOM DIA, NATALIA
              </p>

              <h1 className="text-[38px] font-semibold leading-tight tracking-[-1.5px] text-wisen-titulo md:text-[46px]">
                Central de revisão
              </h1>

              <p className="mt-1 text-[17px] leading-6 text-[#7183A6]">
                Atividades programadas para reforçar o seu aprendizado.
                <br className="hidden sm:block" />
                Revise conceitos a partir de notícias reais e consolide seu conhecimento.
              </p>
            </header>

            {/* Resumo geral */}
            <ResumoRevisoes />

            {/* Área de atividades e sessão */}
            <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(300px,0.9fr)]">
              {/* Quiz de revisão */}
              <QuizRevisao />

              {/* Painel lateral */}
              <aside className="flex flex-col gap-4">
                {/* Sessão de hoje */}
                <SessaoHoje />

                {/* Dica de estudo */}
                <div className="mt-auto">
                  <DicaEstudo />
                </div>
              </aside>
            </div>
          </div>
        </div>
        <Footer variant="cliente" />
      </main>
    </div>
  );
}
