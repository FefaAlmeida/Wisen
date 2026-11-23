const diferenciais = [
  {
    titulo: "O mundo como ponto de partida",
    descricao:
      "Você aprende a partir de acontecimentos reais, com um motivo para entender cada conceito.",
  },
  {
    titulo: "Da leitura à prática",
    descricao: "O assunto continua nos conceitos e nas revisões, em vez de terminar na manchete.",
  },
  {
    titulo: "Aprendizado que se acumula",
    descricao:
      "Cada descoberta ajuda a construir uma base para compreender os próximos acontecimentos.",
  },
];

export function BannerImpacto() {
  return (
    <section
      aria-labelledby="impacto-titulo"
      className="relative -mx-[calc(50vw-50%)] w-screen bg-[#172542] px-6 py-16 text-white sm:px-10 md:px-14 md:py-24"
    >
      <div className="mx-auto max-w-[1360px]">
        <div className="space-y-4">
          <h2
            id="impacto-titulo"
            className="text-[clamp(2.25rem,8vw,3rem)] font-semibold leading-[1.18] tracking-[-0.04em] md:text-[clamp(1.875rem,3vw,2.75rem)]"
          >
            A notícia passa. <br />
            <span className="text-[#E8E191]">O entendimento fica.</span>
          </h2>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-7 border-t border-white/10 pt-7 md:grid-cols-3 md:gap-8">
          {diferenciais.map(({ titulo, descricao }) => (
            <div
              key={titulo}
              className="space-y-3 md:border-l md:border-white/10 md:pl-8 md:first:border-l-0 md:first:pl-0"
            >
              <dt className="text-lg font-medium tracking-[-0.025em] xl:text-xl">{titulo}</dt>
              <dd className="max-w-[350px] text-base leading-[1.75] text-[#BCC8DB]">{descricao}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
