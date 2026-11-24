import { Check } from "lucide-react";
import Link from "next/link";

const beneficios = [
  "Notícias explicadas com clareza",
  "Conexões entre temas e conceitos",
  "Revisões para fixar o que aprendeu",
];

const planos = [
  {
    nome: "Mensal",
    valor: "14,90",
    ciclo: "por mês",
    cobranca: "Cobrado mensalmente",
  },
  {
    nome: "Semestral",
    valor: "79,90",
    ciclo: "a cada 6 meses",
    cobranca: "Equivale a R$ 13,32 por mês",
    economia: "Economize R$ 9,50",
  },
  {
    nome: "Anual",
    valor: "149,90",
    ciclo: "por ano",
    cobranca: "Equivale a R$ 12,49 por mês",
    economia: "Economize R$ 28,90",
    destaque: true,
  },
];

export function PlanosLanding() {
  return (
    <section id="planos" aria-labelledby="planos-titulo" className="scroll-mt-24">
      <div className="mx-auto max-w-[760px] space-y-4 text-center">
        <p className="text-sm font-semibold tracking-[0.14em] text-[#7A6E26] uppercase">
          Planos Wisen
        </p>
        <h2
          id="planos-titulo"
          className="text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1.12] tracking-[-0.045em] text-[#101A40]"
        >
          Mais clareza para aprender, no seu ritmo.
        </h2>
        <p className="text-base leading-relaxed text-[#647184]">
          Escolha o período que funciona melhor para você.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
        {planos.map((plano) => (
          <article
            key={plano.nome}
            className={
              "relative flex flex-col rounded-2xl border p-6 shadow-[0_12px_35px_-28px_rgba(16,26,64,0.35)] " +
              (plano.destaque
                ? "border-[#D9C54E] bg-white ring-1 ring-[#D9C54E]/50"
                : "border-[#DCE5EF] bg-white/90")
            }
          >
            {plano.destaque && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8E191] px-3 py-1 text-xs font-semibold text-[#101A40]">
                Melhor valor
              </span>
            )}
            <h3 className="text-lg font-bold text-[#101A40]">{plano.nome}</h3>
            <p className="mt-5 flex items-baseline gap-1 text-[#101A40]">
              <span className="text-sm font-semibold">R$</span>
              <span className="text-4xl font-bold tracking-tight">{plano.valor}</span>
              <span className="text-sm text-[#647184]">{plano.ciclo}</span>
            </p>
            <p className="mt-2 min-h-5 text-sm text-[#647184]">{plano.cobranca}</p>
            {plano.economia ? (
              <p className="mt-1 text-sm font-semibold text-[#52621F]">{plano.economia}</p>
            ) : (
              <div className="mt-1 h-5" />
            )}

            <ul className="mt-6 flex-1 space-y-3 border-t border-[#E7EDF4] pt-5">
              {beneficios.map((beneficio) => (
                <li key={beneficio} className="flex gap-2.5 text-sm leading-relaxed text-[#40516B]">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#7A6E26]" />
                  {beneficio}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className={
                "mt-7 inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9C54E] " +
                (plano.destaque
                  ? "bg-[#101A40] text-white hover:bg-[#30466E]"
                  : "border border-[#CAD5E3] bg-white text-[#101A40] hover:border-[#D9C54E] hover:bg-[#FBF7E5]")
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
