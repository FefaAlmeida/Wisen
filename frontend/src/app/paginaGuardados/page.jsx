import PainelGuardados from "@/components/guardados/painelGuardados";
import Sidebar from "@/components/sidebar";

export default function PaginaGuardados() {
  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Guardados" />

      <main className="min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_55%_0%,#E6EEF6_0%,#F1F3F6_60%,#F1F3F6_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-9 pb-12 md:px-8">
          {/* Cabeçalho */}
          <section className="relative mb-5 flex min-h-[190px] flex-wrap items-center justify-between gap-5 overflow-hidden">
            <div className="relative z-10 max-w-[520px]">
              <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-[#94A3BC]">
                GUARDADOS
              </p>

              <h1 className="text-[43px] leading-tight font-semibold tracking-[-1.8px] text-wisen-titulo md:text-[50px]">
                Meus guardados
              </h1>

              <p className="mt-1 text-[15px] leading-6 text-[#7183A6]">
                Organize os conteúdos que você quer revisar depois.
              </p>
            </div>

            <div className="relative z-10 flex w-full max-w-[380px] items-start gap-4 rounded-xl bg-white/85 p-6 shadow-sm">
              <span className="text-[32px] text-[#EAC342]">✦</span>

              <div>
                <h2 className="text-[17px] font-semibold text-wisen-titulo">
                  Seus guardados ficam aqui
                </h2>

                <p className="mt-2 text-[14px] leading-5 text-[#8A99B3]">
                  Salve notícias e conceitos para acessar quando quiser e continuar seu aprendizado.
                </p>
              </div>
            </div>
          </section>

          {/* Abas e conteúdo */}
          <PainelGuardados />
        </div>
      </main>
    </div>
  );
}
