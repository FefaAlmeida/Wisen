import { Search } from "lucide-react";
import { Footer } from "@/components/footer";
import PainelGuardados from "@/components/guardados/painelGuardados";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

export default function PaginaGuardados() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Guardados" />

      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_55%_0%,#E6EEF6_0%,#F1F3F6_60%,#F1F3F6_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground />
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
          <div className="px-5 pt-9 pb-12 md:px-8">
            {/* Cabeçalho */}
            <section className="relative mb-5 flex min-h-[190px] flex-wrap items-center justify-between gap-5 overflow-hidden">
              {/* Título e descrição */}
              <div className="relative z-10 max-w-[520px]">
                <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#94A3BC]">
                  GUARDADOS
                </p>

                <h1 className="text-[43px] leading-tight font-semibold tracking-[-1.8px] text-wisen-titulo md:text-[50px]">
                  Meus guardados
                </h1>

                <p className="mt-1 text-[15px] leading-6 text-[#7183A6]">
                  Organize os conteúdos que você quer revisar depois.
                </p>
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
