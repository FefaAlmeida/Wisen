import Link from "next/link";
import { AppTopBar } from "@/components/app/appTopBar";
import { Footer } from "@/components/footer";
import CardInteresse from "@/components/homeCliente/cardInteresse";
import CardNoticia from "@/components/homeCliente/cardNoticia";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import HeroHome from "@/components/homeCliente/heroHome";
import { InitialInterestDialog } from "@/components/homeCliente/initialInterestDialog";
import PainelRevisoes from "@/components/homeCliente/painelRevisoes";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <InitialInterestDialog />
      <Sidebar activeItem="Início" />
      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground />
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <AppTopBar />
          <div className="wisen-container pt-7">
            <HeroHome />
          </div>

          <div className="wisen-container space-y-8 pt-7 pb-12">
            {/* Seu feed de hoje */}
            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="h-[2px] w-6 bg-wisen-destaque" />

                  <h2 className="text-[23px] font-semibold tracking-tight text-wisen-titulo">
                    Seu feed de hoje
                  </h2>
                </div>

                <Link
                  href="/paginaExplorar"
                  className="group inline-flex cursor-pointer items-center text-xs font-medium text-[#30466E] transition-colors hover:text-[#172338]"
                >
                  Ver todas
                  <span className="ml-2 text-[#D6B92F] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
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
              <div className="mb-5 flex items-end gap-4">
                <span className="mb-2 h-[2px] w-6 shrink-0 bg-wisen-destaque" />
                <div>
                  <h2 className="text-[23px] font-semibold tracking-tight text-wisen-titulo">
                    O que você lê diariamente
                  </h2>
                  <p className="mt-1 text-sm text-[#7182A1]">
                    Distribuição dos temas que fazem parte da sua rotina.
                  </p>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 min-[56.25rem]:grid-cols-4">
                <CardInteresse
                  imagem="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=500&q=80"
                  titulo="Economia"
                  porcentagem={38}
                  cor="#EBDD80"
                />

                <CardInteresse
                  imagem="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=500&q=80"
                  titulo="Meio ambiente"
                  porcentagem={27}
                  cor="#A7E0B8"
                />

                <CardInteresse
                  imagem="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80"
                  titulo="Tecnologia"
                  porcentagem={22}
                  cor="#9CC8FF"
                />

                <CardInteresse
                  imagem="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=500&q=80"
                  titulo="Política"
                  porcentagem={13}
                  cor="#D8BCFF"
                />
              </div>
            </section>

            {/* Revisões de hoje */}
            <PainelRevisoes />

            {/* Notícias recomendadas */}
            <section>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="h-[2px] w-6 bg-wisen-destaque" />

                  <h2 className="text-[23px] font-semibold tracking-tight text-wisen-titulo">
                    Notícias que talvez você goste
                  </h2>
                </div>

                <Link
                  href="/paginaExplorar"
                  className="group inline-flex items-center text-xs font-medium text-[#30466E] transition-colors hover:text-[#172338]"
                >
                  Ver mais
                  <span className="ml-2 text-[#D6B92F] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
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
      <Footer variant="cliente" />
    </div>
  );
}
