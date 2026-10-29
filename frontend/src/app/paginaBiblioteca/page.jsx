import Image from "next/image";
import { BarraBusca } from "@/components/barraBusca";
import { CardConceito } from "@/components/biblioteca/cardConceito";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";
import Sidebar from "@/components/sidebar";

import { conceitos } from "@/data/conceitos";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Conceitos" />
      <main className="min-h-screen min-w-0 bg-wisen-superficie px-4 pt-8 pb-12 font-[family-name:var(--font-geist-sans)] sm:ml-[128px] sm:px-5 lg:ml-[220px] lg:px-7 lg:pt-10">
        <div className="mx-auto w-full max-w-[1600px]">
          {/* Apresentação da biblioteca */}
          <section className="relative mb-7 min-h-[145px] md:min-h-[170px] lg:mb-8 lg:min-h-[180px]">
            <div className="relative z-10 pt-2">
              <h1 className="text-[32px] font-semibold leading-tight tracking-[-1.2px] text-wisen-titulo md:text-[40px]">
                Biblioteca de conceitos
              </h1>

              <div className="mt-3 text-[15px] leading-[22px] text-wisen-texto-suave md:text-[16px] md:leading-[24px]">
                <p>Navegue por todos os conceitos mapeados pela plataforma.</p>

                <p>Aprofunde seu conhecimento e acompanhe seu progresso em cada tema.</p>
              </div>
            </div>

            {/* Imagem decorativa */}
            <Image
              src="/bibliotecaHero.png"
              width={240}
              height={200}
              alt="Ilustração de livros representando diferentes áreas do conhecimento"
              className="pointer-events-none absolute top-[-25px] right-0 hidden h-[170px] w-auto object-contain md:block lg:h-[200px]"
            />
          </section>

          {/* Barra de pesquisa */}
          <section className="mb-4 w-full max-w-[670px]">
            <BarraBusca />
          </section>

          {/* Filtros e ordenação */}
          <section className="mb-5 w-full">
            <FiltrosBiblioteca />
          </section>

          {/* Catálogo de conceitos */}
          <section className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {conceitos.map((conceito) => (
              <CardConceito
                key={conceito.titulo}
                titulo={conceito.titulo}
                categoria={conceito.categoria}
                descricao={conceito.descricao}
                status={conceito.status}
                progresso={conceito.progresso}
              />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
