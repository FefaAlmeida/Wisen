import Image from "next/image";

export function ApresentacaoLanding() {
  return (
    <section id="sobre" className="scroll-mt-24 py-8 md:py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-14 xl:gap-20">
        <div className="relative order-2 lg:order-1 lg:col-span-7">
          <div className="pointer-events-none absolute -inset-2 rotate-[2deg] rounded-[30px] border border-[#DDDCA9]/70 bg-[#E8E191]/35 sm:-inset-3" />
          <div className="pointer-events-none absolute -bottom-6 left-[10%] right-[10%] h-16 rounded-full bg-[#30466E]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[25px] border border-[#D5DEE9] bg-gradient-to-br from-white to-[#E7EDF4] p-2.5 shadow-[0_22px_55px_-29px_rgba(16,26,64,0.35)] sm:p-3 lg:absolute lg:inset-0">
            <Image
              src="/paginaInicialSistema-preview.png"
              alt="Captura real da página inicial do Wisen com menu, busca e feed de notícias"
              width={1344}
              height={666}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="block h-auto w-full rounded-[17px] border border-[#DFE6EF] lg:h-full lg:object-cover lg:object-left-top"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2 lg:col-span-5 lg:justify-between lg:pl-3">
          <div className="flex flex-col gap-3">
            <h2 className="max-w-[480px] text-[clamp(2.25rem,7.5vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40] sm:text-[clamp(2rem,3.8vw,3.375rem)]">
              Transforme informação em{" "}
              <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
                conhecimento.
              </span>
            </h2>
          </div>

          <p className="max-w-[460px] text-[15px] leading-[1.9] text-[#647184]">
            O Wisen é uma plataforma de aprendizado que conecta notícias, conceitos e fontes
            confiáveis para ajudar você a entender melhor o mundo.
          </p>

          <ul className="w-full border-t border-[#D5DEE9] text-base font-semibold leading-snug tracking-[-0.025em] text-[#101A40] sm:text-lg">
            {["Conexões mais claras", "Uma visão mais completa", "Decisões mais conscientes"].map(
              (beneficio) => (
                <li
                  key={beneficio}
                  className="flex items-center gap-4 border-b border-[#D5DEE9] py-3"
                >
                  <span aria-hidden="true" className="h-1.5 w-6 shrink-0 bg-[#E8E191]" />
                  {beneficio}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
