import { Search } from "lucide-react";
import DicaEstudo from "@/components/centralRevisao/dicaEstudo";
import QuizRevisao from "@/components/centralRevisao/quizRevisao";
import ResumoRevisoes from "@/components/centralRevisao/resumoRevisoes";
import SessaoHoje from "@/components/centralRevisao/sessaoHoje";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

export default function PaginaRevisoes() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground fadeTop={false} />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-5 pt-3 md:px-8">
            <search className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
                size={16}
              />

              <Input
                type="search"
                aria-label="Buscar notícias, conceitos ou temas"
                placeholder="Pesquise por notícias, conceitos ou temas..."
                className="h-9 rounded-full border-wisen-borda bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
              />
            </search>

            <MenuPerfil />
          </div>

          {/* Conteúdo principal */}
          <div className="px-5 pt-10 pb-12 md:px-8">
            {/* Apresentação */}
            <header className="mb-5">
              <p className="text-[11px] font-semibold text-[#93A3BE]">REVISÕES</p>
              <h1 className="mt-4 text-[36px] leading-[1.05] font-medium text-wisen-titulo sm:text-[44px]">
                Central de <span className="text-[#D7BF4D]">revisão.</span>
              </h1>
            </header>

            <section className="mb-5 rounded-2xl border border-wisen-borda bg-wisen-superficie px-4 py-4 sm:px-5">
              <h2 className="text-sm font-semibold text-wisen-titulo">Sua rotina de revisão</h2>
              <span aria-hidden="true" className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
              <p className="mt-2 text-xs leading-5 text-wisen-texto-suave">
                Atividades programadas para reforçar seu aprendizado. Revise conceitos com base em
                notícias reais e consolide seu conhecimento.
              </p>
            </section>

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
