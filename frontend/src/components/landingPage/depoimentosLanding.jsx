const relatos = [
  {
    perfil: "Liderança de equipe",
    iniciais: "LE",
    texto:
      "O Wisen transforma assuntos complexos em algo claro e acessível. Com ele, consigo entender melhor temas importantes e tomar decisões com mais confiança.",
  },
  {
    perfil: "Profissional especialista",
    iniciais: "PE",
    texto:
      "A plataforma me ajuda a organizar ideias, conectar conteúdos e aprender de forma muito mais leve. O jeito como os temas são apresentados faz toda a diferença.",
  },
  {
    perfil: "Analista",
    iniciais: "AN",
    texto:
      "Desde o início, o Wisen me deu uma visão muito mais clara do que estou aprendendo. É simples, inteligente e extremamente útil no dia a dia.",
  },
];

export function DepoimentosLanding() {
  return (
    <section id="depoimentos" aria-labelledby="relatos-titulo" className="scroll-mt-24">
      <div className="mb-8 space-y-4">
        <h2
          id="relatos-titulo"
          className="max-w-[640px] text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40]"
        >
          O Wisen na sua{" "}
          <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
            rotina.
          </span>
        </h2>
        <p className="text-sm leading-relaxed text-[#647184]">
          Quem usa, recomenda
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        {relatos.map(({ perfil, iniciais, texto }) => (
          <figure
            key={perfil}
            className="flex min-w-0 flex-col rounded-[20px] border border-[#E8E191] bg-[#EAF1F8] p-6 text-left shadow-[0_8px_28px_-20px_rgba(16,26,64,0.22)] transition-[border-color,box-shadow] duration-300 hover:border-[#D9C54E] hover:shadow-[0_20px_38px_-22px_rgba(16,26,64,0.24)] sm:p-7"
          >
            <blockquote className="mb-7 flex-1 text-base leading-[1.8] text-[#30466E]">
              <p>“{texto}”</p>
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-[#D5DEE9] pt-5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8E191] text-xs font-semibold text-[#101A40]"
              >
                {iniciais}
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-[#101A40]">{perfil}</p>
                <p className="text-xs text-[#647184]">Perfil ilustrativo</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
