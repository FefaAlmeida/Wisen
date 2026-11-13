import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function DepoimentosLanding() {
  const depoimentos = [
    {
      id: 1,
      texto:
        "O Wisen transforma assuntos complexos em algo claro e acessível. Com ele, consigo entender melhor temas importantes e tomar decisões com mais confiança.",
      nome: "Marina Costa",
      cargo: "Líder de equipe, Wpmet",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 2,
      texto:
        "A plataforma me ajuda a organizar ideias, conectar conteúdos e aprender de forma muito mais leve. O jeito como os temas são apresentados faz toda a diferença.",
      nome: "Kristen Collins",
      cargo: "Especialista, Wpmet",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 3,
      texto:
        "Desde o início, o Wisen me deu uma visão muito mais clara do que estou aprendendo. É simples, inteligente e extremamente útil no dia a dia.",
      nome: "Amanda Long",
      cargo: "Analista, Wpmet",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 4,
      texto:
        "O Wisen me ajuda a acompanhar o que acontece no mundo com muito mais clareza, sem ficar perdido entre tantas informações.",
      nome: "Catarina Silva",
      cargo: "Product Designer, Wpmet",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=150&auto=format&fit=crop",
    },
  ];

  return (
    <section id="depoimentos" className="scroll-mt-24">
      <div className="space-y-8">
        <div className="space-y-3 text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8491A3]">
            DEPOIMENTOS
          </span>

          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40]">
            Quem usa,
            <br />
            <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
              recomenda.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {depoimentos.map((item) => (
            <Card
              key={item.id}
              className="group flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[14px] border border-[#EDEDED] bg-[#F7F7F5] p-0 shadow-[0_0_0_1px_rgba(16,26,64,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(16,26,64,0.28)]"
            >
              <CardContent className="flex flex-1 flex-col items-center justify-between px-5 py-5 text-center sm:px-5 sm:py-6">
                <div className="flex w-full flex-col items-center justify-center gap-3">
                  <div className="flex items-center justify-center gap-1 text-[#D7B458]">
                    {["um", "dois", "três", "quatro", "cinco"].map((star) => (
                      <Star key={star} className="h-3.5 w-3.5 fill-[#D7B458] text-[#D7B458]" />
                    ))}
                  </div>

                  <p className="max-w-[220px] text-[13px] leading-[1.7] font-medium text-[#202020]">
                    {item.texto}
                  </p>
                </div>

                <div className="mt-4 flex w-full flex-col items-center justify-center gap-3">
                  <Image
                    src={item.avatar}
                    width={68}
                    height={68}
                    alt={item.nome}
                    sizes="68px"
                    className="h-[68px] w-[68px] rounded-full border-2 border-white object-cover shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                  />

                  <div className="space-y-1 text-center">
                    <h4 className="text-[15px] font-bold text-[#101A40]">{item.nome}</h4>
                    <p className="text-[12px] text-[#5B6474]">{item.cargo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
