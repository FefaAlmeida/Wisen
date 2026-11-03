
import { Search } from "lucide-react";
import Image from "next/image";

import { CardConceito } from "@/components/biblioteca/cardConceito";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";

import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

import { conceitos } from "@/data/conceitos";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Conceitos" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_70%_0%,#E3EAF4_0%,#F0F4F9_55%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">

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
          <div className="px-4 pb-12 pt-3 sm:px-5 lg:px-7 lg:pt-4">

            {/* Apresentação da biblioteca */}
            <section className="relative mb-7 flex min-h-[260px] items-center overflow-hidden md:min-h-[290px] lg:mb-8 lg:min-h-[320px]">
              <div className="relative z-10 max-w-[660px] py-8 md:max-w-[58%]">
                <p className="text-[11px] font-semibold text-[#93A3BE]">
                  BIBLIOTECA DE CONCEITOS
                </p>

                <h1 className="mt-4 text-[36px] leading-[1.05] font-medium text-wisen-titulo sm:text-[44px] lg:text-[50px]">
                  Explore conceitos.
                  <span className="block text-[#D7BF4D]">Conecte ideias.</span>
                </h1>

                <p className="mt-4 max-w-[470px] text-[15px] leading-6 text-[#7182A1]">
                  Descubra as ideias por trás das notícias e acompanhe seu progresso em cada tema.
                </p>
              </div>

              <Image
                src="/bibliotecaHeroCerta.png"
                width={1916}
                height={821}
                alt="Ilustração de livros representando diferentes áreas do conhecimento"
                sizes="(min-width: 1536px) 600px, (min-width: 1280px) 530px, (min-width: 1024px) 315px, 35vw"
                className="pointer-events-none absolute top-1/2 right-0 hidden w-[42%] max-h-[260px] -translate-y-1/2 object-contain md:block"
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
    </div>
  );
}
