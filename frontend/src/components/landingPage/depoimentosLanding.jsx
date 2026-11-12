import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function DepoimentosLanding() {
  const depoimentos = [
    {
      id: 1,
      texto:
        "O Wisen ajuda-me a entender temas que sempre pareceram muito complicados. As ideias conectam-se e fazem sentido.",
      nome: "Mariana S.",
      cargo: "Estudante",
      corCartao: "bg-white border-[#E2E8F0]",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 2,
      texto:
        "A plataforma é muito intuitiva e os conteúdos realmente são excelentes. Consigo ver o mundo com outros olhos.",
      nome: "Lucas T.",
      cargo: "Professor",
      corCartao: "bg-[#FBFAF2] border-[#E9E4BE]",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 3,
      texto:
        "Mudou completamente a forma como me informo sobre os assuntos do dia. Os fechamentos de mapas mentais são incríveis.",
      nome: "Carla M.",
      cargo: "Analista",
      corCartao: "bg-white border-[#E2E8F0]",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
  ];

  return (
    <section id="depoimentos" className="scroll-mt-24">
      <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-12 lg:gap-12">
        {/* Título */}
        <div className="space-y-5 lg:sticky lg:top-28 lg:col-span-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8491A3]">
            DEPOIMENTOS
          </span>

          <h2 className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.19] tracking-[-0.045em] text-[#101A40]">
            Quem usa,
            <br />
            <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
              recomenda.
            </span>
          </h2>
        </div>

        {/* Cards de depoimentos */}
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-4">
          {depoimentos.map((item) => (
            <Card
              key={item.id}
              className={`group flex h-full min-h-[280px] flex-col gap-0 overflow-hidden rounded-[20px] border p-0 shadow-[0_8px_28px_-20px_rgba(16,26,64,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(16,26,64,0.25)] ${item.corCartao}`}
            >
              <CardContent className="flex flex-1 flex-col justify-between gap-8 p-6">
                {/* Depoimento */}
                <p className="text-[13px] font-normal italic leading-[1.95] text-[#586679]">
                  "{item.texto}"
                </p>

                {/* Pessoa */}
                <div className="flex items-center gap-3 border-t border-[#DDE4EC] pt-5">
                  <Image
                    src={item.avatar}
                    width={40}
                    height={40}
                    alt={item.nome}
                    sizes="40px"
                    className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="min-w-0 space-y-1">
                    <h4 className="text-[12px] font-bold text-[#101A40]">{item.nome}</h4>

                    <p className="text-[11px] text-[#8996A8]">{item.cargo}</p>
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
