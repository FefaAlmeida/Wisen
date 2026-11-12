import Image from "next/image";

export function BannerImpacto() {
  const metricas = [
    { valor: "+10 mil", legenda: "estudantes e profissionais" },
    { valor: "+5 mil", legenda: "temas pesquisados" },
    { valor: "+2 mil", legenda: "conexões em mapas mentais" },
    { valor: "92%", legenda: "recomendam o Wisen" },
  ];

  return (
    <section className="relative">
      <div className="relative isolate overflow-hidden rounded-[28px] border border-[#293B5C] bg-[#172542] px-6 py-11 text-white shadow-[0_24px_65px_-40px_rgba(16,26,64,0.5)] sm:px-10 md:px-14 md:py-16">
        {/* Imagem original */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
          <Image
            src="/meuBanner.png"
            alt=""
            fill
            sizes="(max-width: 1200px) calc(100vw - 3rem), 69rem"
            className="object-cover mix-blend-overlay"
          />
        </div>

        {/* Integração do fundo */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#172542]/95 via-[#172542]/75 to-[#30466E]/30" />

        <div className="pointer-events-none absolute -right-24 -top-28 z-0 h-80 w-80 rounded-full bg-[#E8E191]/10 blur-3xl" />

        <div className="relative z-10 space-y-12">
          {/* Título */}
          <div className="max-w-[700px] space-y-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8E191]">
              CONHECIMENTO QUE GERA IMPACTO
            </span>

            <h2 className="text-[clamp(2.1rem,3.6vw,3.3rem)] font-bold leading-[1.16] tracking-[-0.045em] text-white">
              Mais clareza hoje,
              <br />
              mais entendo amanhã.
            </h2>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/15 pt-10 md:grid-cols-4 md:gap-5">
            {metricas.map((item) => (
              <div
                key={item.legenda}
                className="group space-y-3 md:border-l md:border-white/15 md:pl-6 md:first:border-l-0 md:first:pl-0"
              >
                <span className="block text-[clamp(2rem,3.4vw,3.1rem)] font-bold leading-none tracking-[-0.055em] text-white transition-colors duration-300 group-hover:text-[#E8E191]">
                  {item.valor}
                </span>

                <span className="block max-w-[180px] text-[12px] font-medium leading-[1.7] text-[#BDCADB]">
                  {item.legenda}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
