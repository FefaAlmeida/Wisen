import Image from "next/image";

export function BannerImpacto() {
  const metricas = [
    { valor: "+10 mil", legenda: "estudantes e profissionais" },
    { valor: "+5 mil", legenda: "temas pesquisados" },
    { valor: "+2 mil", legenda: "conexões em mapas mentais" },
    { valor: "92%", legenda: "recomendam o Wisen" },
  ];

  return (
    <section className="py-6">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1E2530] via-[#2B333F] to-[#1E2530] text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <Image
            src="/meuBanner.png" /* <-- Nome exato do arquivo que você colocou na pasta public */
            alt=""
            fill
            sizes="100vw"
            className="object-cover mix-blend-overlay"
          />
        </div>

        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#E8E191]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-10">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-bold tracking-wider text-[#E8E191] uppercase">
              CONHECIMENTO QUE GERA IMPACTO
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Mais clareza hoje,
              <br /> mais entendo amanhã.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-700/60">
            {metricas.map((item) => (
              <div key={item.legenda} className="space-y-1">
                <span className="text-3xl md:text-4xl font-black text-white block">
                  {item.valor}
                </span>
                <span className="text-xs text-slate-300 font-medium block">{item.legenda}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
