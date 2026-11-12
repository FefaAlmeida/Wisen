
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  BookOpen,
  ChevronRight,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecursosLanding() {
  const recursos = [
    {
      id: 1,
      titulo: "Explicação simples",
      descricao:
        "Um olhar simplificado, com linguagem acessível para qualquer perfil de público.",
      icone: BookOpen,
      corIcone: "bg-[#E9EEF6] text-[#30466E]",
    },
    {
      id: 2,
      titulo: "Conexão confiável",
      descricao:
        "Fontes de qualidade, com curadoria e análise para a sua escolha.",
      icone: ShieldCheck,
      corIcone: "bg-[#F4F1D8] text-[#847537]",
    },
    {
      id: 3,
      titulo: "Mapas de conhecimento",
      descricao:
        "Veja a relação entre ideias, temas e o conhecimento de forma visual.",
      icone: Network,
      corIcone: "bg-[#E9EEF6] text-[#30466E]",
    },
    {
      id: 4,
      titulo: "Resumo sob medida",
      descricao:
        "Aprendizado no seu ritmo, com o nível de profundidade que você precisa.",
      icone: BarChart3,
      corIcone: "bg-[#F4F1D8] text-[#847537]",
    },
    {
      id: 5,
      titulo: "Guardados",
      descricao:
        "Salve conteúdos e construa seu conhecimento com total personalização.",
      icone: Bookmark,
      corIcone: "bg-[#E9EEF6] text-[#30466E]",
    },
    {
      id: 6,
      titulo: "Temas que você gosta",
      descricao:
        "Receba novas perspetivas sobre os assuntos que realmente importam.",
      icone: Sparkles,
      corIcone: "bg-[#F4F1D8] text-[#847537]",
    },
  ];

  return (
    <section
      id="funcionalidades"
      className="scroll-mt-24"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">

        {/* Introdução */}
        <div className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8491A3]">
            FUNCIONALIDADES
          </span>

          <h2 className="max-w-[450px] text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.19] tracking-[-0.045em] text-[#101A40]">
            Tudo o que você precisa para entender mais e{" "}
            <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
              ir além.
            </span>
          </h2>

          <p className="max-w-[370px] text-[15px] leading-[1.9] text-[#647184]">
            Ferramentas essenciais para transformar informação em aprendizado real.
          </p>

          <Button className="group h-12 cursor-pointer gap-3 rounded-xl bg-[#101A40] px-6 text-[13px] font-semibold text-white shadow-[0_10px_22px_-12px_rgba(16,26,64,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#30466E]">
            <span>Explorar todas as funcionalidades</span>
            <ArrowRight className="h-4 w-4 text-[#E8E191] transition-transform duration-300 group-hover:translate-x-1" />
          </Button>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">

          {recursos.map((item) => {
            const Icone = item.icone;

            return (
              <div
                key={item.id}
                className="group relative flex min-h-[218px] flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_28px_-20px_rgba(16,26,64,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D1DCE8] hover:shadow-[0_20px_38px_-22px_rgba(16,26,64,0.24)]"
              >

                {/* Luz suave no topo */}
                <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-[#E8E191]/0 blur-2xl transition-colors duration-500 group-hover:bg-[#E8E191]/20" />

                <div className="relative z-10 flex items-center justify-between">

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${item.corIcone} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icone className="h-[21px] w-[21px]" />
                  </div>

                  <ChevronRight className="h-4 w-4 text-[#B2BECC] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#30466E]" />

                </div>

                <div className="relative z-10 mt-7 space-y-2.5">

                  <h3 className="text-[15px] font-bold tracking-tight text-[#101A40]">
                    {item.titulo}
                  </h3>

                  <p className="text-[13px] leading-[1.85] text-[#718095]">
                    {item.descricao}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
