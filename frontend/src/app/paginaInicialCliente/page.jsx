import Sidebar from "@/components/sidebar";
import HeroHome from "@/components/homeCliente/heroHome";
import CardNoticia from "@/components/homeCliente/cardNoticia";
import CardInteresse from "@/components/homeCliente/cardInteresse";
import PainelRevisoes from "@/components/homeCliente/painelRevisoes";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Início" />
      <main className="min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_70%_0%,#E3EAF4_0%,#F0F4F9_55%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
      <div className="mx-auto w-full max-w-[1600px]">


        {/* Hero */}
        <div className="relative flex min-h-[410px] items-center overflow-hidden pt-14 md:min-h-[350px] md:pt-0">
          <div className="absolute inset-x-4 top-3 z-20 flex items-center justify-end gap-3 sm:left-auto sm:right-6 md:right-10">
            <div role="search" className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7182A1]"
                size={16}
              />
              <Input
                type="search"
                aria-label="Buscar notícias, conceitos ou temas"
                placeholder="Pesquise por notícias, conceitos ou temas..."
                className="h-9 rounded-full border-[#DCE3ED] bg-white/90 pl-9 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
              />
            </div>
            <Link
              href="/paginaPerfil"
              aria-label="Abrir perfil"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F3E69A] text-[11px] font-semibold text-[#263551] shadow-sm transition-colors hover:bg-[#EBDD80]"
            >
              NB
            </Link>
          </div>

          <div className="relative z-10 w-full md:w-[60%]">
            <HeroHome />
          </div>

          <div className="relative hidden h-[350px] flex-1 md:block">
            <Image
              src="/foto_paginaInicialCliente.png"
              alt="Planeta com conexões do Wisen"
              fill
              priority
              sizes="(max-width: 1024px) 40vw, 35vw"
              className="object-contain object-right"
            />
          </div>
        </div>

        <div className="space-y-9 px-5 pb-12 md:px-8">

          {/* Seu feed de hoje */}
          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-6 bg-[#E0C43F]" />

                <h2 className="text-[23px] font-semibold tracking-tight text-[#101A40]">
                  Seu feed de hoje
                </h2>
              </div>

              <span className="group inline-flex cursor-pointer items-center text-xs font-medium text-[#30466E] transition-colors hover:text-[#172338]">
                Ver todas
                <span className="ml-2 text-[#D6B92F] transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CardNoticia
                imagem="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80"
                categoria="Economia"
                tempo="há 2 horas"
                titulo="Copom mantém taxa Selic em 10,50% ao ano"
                descricao="Decisão impacta crédito, inflação e crescimento econômico no país."
                conceitos={["Selic", "Inflação", "Política monetária"]}
              />

              <CardNoticia
                imagem="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
                categoria="Meio ambiente"
                tempo="há 5 horas"
                titulo="Estudo aponta aceleração do derretimento das geleiras"
                descricao="Pesquisadores alertam para impactos globais nas próximas décadas."
                conceitos={["Clima", "Geleiras", "Aquecimento global"]}
              />

              <CardNoticia
                imagem="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80"
                categoria="Tecnologia"
                tempo="há 8 horas"
                titulo="Inteligência artificial ganha espaço na educação"
                descricao="Ferramentas de IA estão transformando a forma de ensinar e aprender."
                conceitos={["IA", "Educação", "Tecnologia"]}
              />
            </div>
          </section>

          {/* O que você lê diariamente */}
          <section>
            <div className="mb-5 flex items-center gap-4">
              <span className="h-[2px] w-6 bg-[#E0C43F]" />

              <h2 className="text-[23px] font-semibold tracking-tight text-[#101A40]">
                O que você lê diariamente
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CardInteresse
                imagem="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80"
                titulo="Economia"
                porcentagem={38}
              />

              <CardInteresse
                imagem="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80"
                titulo="Meio ambiente"
                porcentagem={27}
              />

              <CardInteresse
                imagem="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80"
                titulo="Tecnologia"
                porcentagem={22}
              />

              <CardInteresse
                imagem="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=500&q=80"
                titulo="Política"
                porcentagem={13}
              />
            </div>
          </section>

          {/* Revisões de hoje */}
          <PainelRevisoes />

          {/* Notícias recomendadas */}
          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="h-[2px] w-6 bg-[#E0C43F]" />

                <h2 className="text-[23px] font-semibold tracking-tight text-[#101A40]">
                  Notícias que talvez você goste
                </h2>
              </div>

              <span className="group inline-flex cursor-pointer items-center text-xs font-medium text-[#30466E] transition-colors hover:text-[#172338]">
                Ver mais
                <span className="ml-2 text-[#D6B92F] transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CardNoticia
                imagem="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80"
                categoria="Tecnologia"
                tempo="há 1 dia"
                titulo="Novas tecnologias ampliam o acesso à informação"
                descricao="Ferramentas digitais transformam a maneira como as pessoas consomem notícias."
                conceitos={["Tecnologia", "Informação"]}
              />

              <CardNoticia
                imagem="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80"
                categoria="Meio ambiente"
                tempo="há 1 dia"
                titulo="Pesquisadores analisam mudanças no clima global"
                descricao="Estudos reforçam a importância de compreender os impactos ambientais."
                conceitos={["Clima", "Sustentabilidade"]}
              />

              <CardNoticia
                imagem="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"
                categoria="Economia"
                tempo="há 2 dias"
                titulo="Cenário econômico influencia decisões do mercado"
                descricao="Indicadores ajudam a compreender tendências e movimentos da economia."
                conceitos={["Mercado", "Economia"]}
              />
            </div>
          </section>

        </div>
      </div>
      </main>
    </div>
  );
}
