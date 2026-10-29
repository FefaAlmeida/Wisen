export default function ApresentacaoLogin({ showCopy = true, showBrand = true }) {
  return (
    <section className="relative flex min-h-[420px] flex-col items-center justify-start overflow-hidden bg-[#202C3B] px-10 pt-7 pb-10 text-white lg:min-h-screen lg:px-14 lg:pt-10 lg:pb-14">
      <div
        className="absolute inset-0 bg-[length:auto_120%] bg-[position:center_top] bg-no-repeat"
        style={{ backgroundImage: "url('/globoWisen.png')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#202C3B]/75 via-transparent to-[#101B29]/20" />

      {showCopy && (
        <div
          className={`relative z-10 w-full max-w-2xl ${
            showBrand ? "mx-auto text-center" : "mr-auto translate-x-2 text-left lg:translate-x-4"
          }`}
        >
          {showBrand && (
            <div className="flex items-center justify-center">
              <span className="text-5xl font-light tracking-[-0.06em] lg:text-6xl">Wisen</span>
              <span aria-hidden="true" className="ml-1.5 h-2 w-2 rounded-full bg-[#F2DF73]" />
            </div>
          )}

          <div className={`max-w-md ${showBrand ? "mx-auto mt-8 lg:mt-10" : ""}`}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F2DF73]" />
              CONHECIMENTO QUE CONECTA
            </div>

            <h1 className="text-4xl leading-[1.08] font-semibold tracking-[-0.04em] lg:text-[52px]">
              Entenda o mundo
              <span className="block text-[#F2DF73]">com mais clareza.</span>
            </h1>

            <p
              className={`mt-5 max-w-[360px] text-sm leading-7 text-white/80 lg:text-base ${
                showBrand ? "mx-auto" : ""
              }`}
            >
              Conhecimento confiável, análises profundas e conexões que ajudam você a tomar melhores
              decisões.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
