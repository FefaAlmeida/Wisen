import FormularioLogin from "@/components/formularioLogin";

export default function LoginPage() {
  return (
    <main className="relative isolate grid min-h-screen grid-cols-1 overflow-hidden font-[family-name:var(--font-geist-sans)] lg:grid-cols-[56%_44%]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-[position:center_top] bg-no-repeat"
        style={{ backgroundImage: "url('/globoWisen.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080F1C]/65 via-[#080F1C]/40 to-[#080F1C]/55"
      />

      <section className="order-2 hidden items-center px-6 py-12 text-white sm:px-12 lg:order-1 lg:flex lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-2xl lg:mx-0 lg:-translate-y-8 lg:translate-x-4">
          <div className="mb-8 flex items-center">
            <span className="text-6xl font-semibold tracking-[-0.075em] sm:text-7xl lg:text-[88px]">
              Wisen
            </span>
            <span
              aria-hidden="true"
              className="mb-9 ml-2 h-3 w-3 rounded-full bg-[#F2DF73] lg:mb-12"
            />
          </div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[56px]">
            Entenda o mundo
            <span className="block text-[#F2DF73]">com mais clareza.</span>
          </h1>
          <p className="mt-6 max-w-[390px] text-sm leading-7 text-white/85 sm:text-base">
            Conhecimento confiável, análises profundas e conexões que ajudam você a tomar melhores
            decisões.
          </p>
        </div>
      </section>

      <section className="order-1 flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:order-2">
        <div className="relative w-full max-w-[450px] lg:-translate-x-4">
          <div className="mb-6 flex flex-col items-center text-white lg:hidden">
            <div className="flex items-center justify-center">
              <span className="text-3xl font-semibold tracking-[-0.06em]">Wisen</span>
              <span aria-hidden="true" className="ml-1.5 h-2 w-2 rounded-full bg-[#F2DF73]" />
            </div>
            <span className="mt-1.5 text-[9px] font-semibold tracking-[0.2em] text-white/80">
              CONHECIMENTO QUE CONECTA
            </span>
          </div>
          <FormularioLogin glass />
        </div>
      </section>
    </main>
  );
}
