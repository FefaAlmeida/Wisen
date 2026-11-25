import { Check } from "lucide-react";
import Link from "next/link";

const planos = [
  {
    nome: "Mensal",
    valor: "14,90",
    ciclo: "por mês",
    indicacao: "Ideal para quem quer experimentar a Wisen por um mês.",
  },
  {
    nome: "Semestral",
    valor: "79,90",
    ciclo: "a cada 6 meses",
    equivalenteMensal: "R$ 13,32 por mês",
    economia: "Economize R$ 9,50",
    indicacao: "Ideal para quem quer criar uma rotina de estudos ao longo do semestre.",
  },
  {
    nome: "Anual",
    valor: "149,90",
    ciclo: "por ano",
    equivalenteMensal: "R$ 12,49 por mês",
    economia: "Economize R$ 28,90",
    indicacao:
      "Ideal para quem quer usar a Wisen o ano todo e ter o menor custo mensal equivalente.",
    destaque: true,
  },
];

export function PlanosLanding() {
  return (
    <section id="planos" aria-labelledby="planos-titulo" className="scroll-mt-24">
      <h2
        id="planos-titulo"
        className="mb-8 max-w-[640px] text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40]"
      >
        Confira os planos da Wisen e{" "}
        <span className="decoration-[#E8E191] decoration-[6px] underline underline-offset-[7px]">
          comece já!
        </span>
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-x-6">
        {planos.map((plano) => (
          <article
            key={plano.nome}
            className={
              "grid min-w-0 gap-4 rounded-2xl border bg-card p-3 shadow-[0_12px_28px_-20px_rgba(16,26,64,0.45)] md:row-span-3 md:grid-rows-subgrid " +
              (plano.destaque ? "border-[#D9C54E]" : "border-wisen-borda")
            }
          >
            <header className="rounded-xl bg-[#F0F5FB] p-4 lg:px-5">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <h3 className="text-lg font-bold text-[#101A40] after:mt-1 after:block after:h-0.5 after:w-7 after:rounded-full after:bg-[#C8B340] after:content-['']">
                  {plano.nome}
                </h3>
                {plano.destaque && (
                  <span className="rounded-full bg-[#E8E191] px-2.5 py-1 text-xs font-semibold text-[#101A40]">
                    Melhor valor
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm text-[#52627B]">
                <span className="block font-bold text-[#244C91]">
                  <span className="text-lg">R$</span>{" "}
                  <span className="text-[2.5rem] leading-none tracking-tight tabular-nums">
                    {plano.valor}
                  </span>
                </span>
                <span className="mt-1 block">{plano.ciclo}</span>
              </p>
            </header>

            <div className="space-y-2 px-2 text-sm leading-relaxed text-[#40516B] lg:px-3">
              <p className="flex items-center gap-2 font-semibold text-[#101A40]">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#F3EDBC] text-[#6C5E22]">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                Acesso completo à Wisen
              </p>
              <p>
                Cobrança de{" "}
                <strong className="font-semibold">
                  R$ {plano.valor} {plano.ciclo}
                </strong>
                .
              </p>
              <p>{plano.indicacao}</p>
              {plano.equivalenteMensal && (
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-t border-wisen-borda pt-2">
                  <p>
                    Equivale a <strong className="font-semibold">{plano.equivalenteMensal}</strong>
                  </p>
                  <p className="font-semibold text-[#52621F]">{plano.economia}</p>
                </div>
              )}
            </div>
            <Link
              href="/auth"
              className={
                "mx-2 mb-2 inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9C54E] lg:mx-3 lg:mb-3 " +
                (plano.destaque
                  ? "bg-[#101A40] text-white hover:bg-[#30466E]"
                  : "border border-[#CAD5E3] bg-white text-[#101A40] hover:border-[#D9C54E] hover:bg-wisen-hover")
              }
            >
              Começar
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
