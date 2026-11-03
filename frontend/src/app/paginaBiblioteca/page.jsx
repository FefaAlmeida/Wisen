
import { Search } from "lucide-react";
import Image from "next/image";

import { CardConceito } from "@/components/biblioteca/cardConceito";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";

import Sidebar from "@/components/sidebar";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import { Input } from "@/components/ui/input";

import { conceitos } from "@/data/conceitos";

import { Footer } from "@/components/footer";




export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Conceitos" />

      <main className="min-h-screen min-w-0 bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">

        <div className="mx-auto w-full max-w-[1600px]">

          {/* Barra de pesquisa e perfil */}
          <div className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">

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
          <div className="px-4 pb-12 pt-8 sm:px-5 lg:px-7 lg:pt-10">

            {/* Apresentação da biblioteca */}
            <section className="relative mb-7 min-h-[145px] md:min-h-[170px] lg:mb-8 lg:min-h-[180px]">

              <div className="relative z-10 pt-2">

                <h1 className="text-[32px] font-semibold leading-tight tracking-[-1.2px] text-wisen-titulo md:text-[40px]">
                  Biblioteca de conceitos
                </h1>

                <div className="mt-3 text-[15px] leading-[22px] text-wisen-texto-suave md:text-[16px] md:leading-[24px]">

                  <p>
                    Navegue por todos os conceitos mapeados pela plataforma.
                  </p>

                  <p>
                    Aprofunde seu conhecimento e acompanhe seu progresso em cada tema.
                  </p>

                </div>
              </div>

              {/* Imagem decorativa */}
              <Image
                src="/bibliotecaHeroCerta.png"
                width={240}
                height={200}
                alt="Ilustração de livros representando diferentes áreas do conhecimento"
                className="pointer-events-none absolute top-[-25px] right-0 hidden h-[170px] w-auto object-contain md:block lg:h-[200px]"
              />

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
        </div>
      </main>

        <Footer />
    </div>
  );
}
