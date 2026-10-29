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
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 2,
      texto:
        "A plataforma é muito intuitiva e os conteúdos realmente são excelentes. Consigo ver o mundo com outros olhos.",
      nome: "Lucas T.",
      cargo: "Professor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    {
      id: 3,
      texto:
        "Mudou completamente a forma como me informo sobre os assuntos do dia. Os fechamentos de mapas mentais são incríveis.",
      nome: "Carla M.",
      cargo: "Analista",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-12 border-t border-slate-100" id="depoimentos">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-28">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            DEPOIMENTOS
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-[#2B333F] tracking-tight leading-tight">
            Quem usa,
            <br />
            <span className="border-b-4 border-[#E8E191]">recomenda.</span>
          </h2>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {depoimentos.map((item) => (
            <Card
              key={item.id}
              className="border border-slate-200/80 shadow-xs bg-white rounded-2xl flex flex-col justify-between p-6 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0 space-y-6 flex flex-col justify-between h-full">
                <p className="text-xs text-slate-600 leading-relaxed font-normal italic">
                  "{item.texto}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <Image
                    src={item.avatar}
                    width={36}
                    height={36}
                    alt={item.nome}
                    sizes="36px"
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#2B333F]">{item.nome}</h4>
                    <p className="text-[10px] text-slate-400">{item.cargo}</p>
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
