
import { BarraBusca } from "@/components/barraBusca";
import { FiltrosBiblioteca } from "@/components/filtrosBiblioteca";
import { CardConceito } from "@/components/cardConceito";

const conceitos = [
  {
    titulo: "Taxa Selic",
    categoria: "Economia",
    descricao:
      "Taxa básica de juros da economia brasileira, definida pelo Banco Central, que influencia crédito, inflação e atividade econômica.",
    status: "Em revisão",
    progresso: 60,
  },
  {
    titulo: "Inflação",
    categoria: "Economia",
    descricao:
      "Aumento generalizado e contínuo dos preços de bens e serviços em uma economia ao longo do tempo.",
    status: "Dominado",
    progresso: 85,
  },
  {
    titulo: "Política monetária",
    categoria: "Economia",
    descricao:
      "Conjunto de ações do Banco Central para controlar a inflação, estimular o crescimento e manter a estabilidade da economia.",
    status: "Lacuna",
    progresso: 25,
  },
  {
    titulo: "Gases de efeito estufa",
    categoria: "Meio ambiente",
    descricao:
      "Gases que retêm o calor na atmosfera, como dióxido de carbono (CO₂) e metano (CH₄), intensificando o aquecimento global.",
    status: "Em revisão",
    progresso: 55,
  },
  {
    titulo: "Aquecimento global",
    categoria: "Meio ambiente",
    descricao:
      "Aumento da temperatura média do planeta causado principalmente pelo aumento das emissões de gases de efeito estufa.",
    status: "Dominado",
    progresso: 90,
  },
  {
    titulo: "Aprendizado de máquina",
    categoria: "Tecnologia",
    descricao:
      "Área da inteligência artificial que permite que sistemas aprendam padrões a partir de dados, sem serem explicitamente programados.",
    status: "Em revisão",
    progresso: 45,
  },
  {
    titulo: "Regulação de IA",
    categoria: "Tecnologia",
    descricao:
      "Conjunto de normas e diretrizes para o desenvolvimento e uso responsável da inteligência artificial na sociedade.",
    status: "Lacuna",
    progresso: 30,
  },
  {
    titulo: "Comércio internacional",
    categoria: "Economia",
    descricao:
      "Troca de bens, serviços e capitais entre países, influenciada por tarifas, acordos comerciais e relações geopolíticas.",
    status: "Dominado",
    progresso: 80,
  },
];


export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[radial-gradient(ellipse_at_65%_0%,#E4EAF3_0%,#F0F4F9_55%,#F0F4F9_100%)] px-5 pt-8 pb-12 font-[family-name:var(--font-geist-sans)] sm:px-7 lg:px-9 lg:pt-10">
      <div className="mx-auto w-full max-w-[1500px]">

        {/* Apresentação da biblioteca */}
        <section className="relative mb-7 min-h-[145px] md:min-h-[170px] lg:mb-8 lg:min-h-[180px]">

          <div className="relative z-10 pt-2">
            <h1 className="text-[32px] font-semibold leading-tight tracking-[-1.2px] text-[#101A40] md:text-[40px]">
              Biblioteca de conceitos
            </h1>

            <div className="mt-3 text-[15px] leading-[22px] text-[#7483A3] md:text-[16px] md:leading-[24px]">
              <p>
                Navegue por todos os conceitos mapeados pela plataforma.
              </p>

              <p>
                Aprofunde seu conhecimento e acompanhe seu progresso em cada tema.
              </p>
            </div>
          </div>

          {/* Imagem decorativa */}
          <img
            src="/bibliotecaHero.png"
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
  );
}

