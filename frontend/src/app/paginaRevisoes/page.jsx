
import Sidebar from "@/components/sidebar";

import ResumoRevisoes from "@/components/centralRevisao/resumoRevisoes";
import QuizRevisao from "@/components/centralRevisao/quizRevisao";
import SessaoHoje from "@/components/centralRevisao/sessaoHoje";
import DicaEstudo from "@/components/centralRevisao/dicaEstudo";

export default function PaginaRevisoes() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Revisões" />

      <main className="min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_60%_0%,#E4EDF5_0%,#F0F4F9_60%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-10 pb-12 md:px-8">

          {/* Apresentação */}
          <header className="mb-6">
            <p className="mb-5 text-[11px] font-semibold tracking-[0.25em] text-[#93A3BE]">
              BOM DIA, NATALIA ☀️
            </p>

            <h1 className="text-[38px] font-semibold leading-tight tracking-[-1.5px] text-[#101A40] md:text-[46px]">
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

         
          <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(300px,0.9fr)]">
            <QuizRevisao />
            
            <aside className="flex flex-col gap-4">
              <SessaoHoje />
            
              <div className="mt-auto">
                <DicaEstudo />
              </div>
            </aside>
          </div>


        </div>
      </main>
    </div>
  );
}
