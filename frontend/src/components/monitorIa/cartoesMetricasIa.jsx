import cards from "@/components/meuConhecimento/constancia.module.css";

function CartaoMetrica({ titulo, children, detalhe }) {
  return (
    <div className={cards.card}>
      <header className={cards.heading}>
        <h2>{titulo}</h2>
      </header>
      <div className={cards.body}>{children}</div>
      <div className={cards.support}>{detalhe}</div>
      <div className={cards.bottomRule} aria-hidden="true" />
    </div>
  );
}

function LinhaTendencia({ caminho, cor }) {
  return (
    <svg
      aria-hidden="true"
      className="block h-8 w-full"
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
    >
      <path
        d={caminho}
        fill="none"
        stroke={cor}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function CartoesMetricasIa() {
  return (
    <section className={`grid ${cards.group}`} aria-label="Resumo de uso de IA">
      <CartaoMetrica
        titulo="Orçamento mensal"
        detalhe={
          <div className="grid gap-2">
            <div className={cards.masteredProgress}>
              <div
                className={cards.progress}
                role="progressbar"
                aria-label="Orçamento mensal utilizado"
                aria-valuenow={68}
              >
                <span style={{ width: "68%", backgroundColor: "#d4ad2b" }} />
              </div>
              <span className={cards.masteredPercent}>68%</span>
            </div>
            <p className="text-xs text-wisen-texto-suave">R$ 31,60 restantes até o limite mensal</p>
          </div>
        }
      >
        <div className="grid gap-1">
          <strong className="text-[clamp(1.5rem,16cqi,2.75rem)] leading-none font-[650] tracking-[-0.04em] whitespace-nowrap">
            R$ 68,40
          </strong>
          <span className="text-xs text-wisen-texto-suave">de R$ 100,00</span>
        </div>
      </CartaoMetrica>

      <CartaoMetrica
        titulo="Requisições totais"
        detalhe={<LinhaTendencia caminho="M 0 15 Q 25 18, 50 10 T 100 5" cor="#94a3b8" />}
      >
        <div>
          <div className={`${cards.value} flex-wrap`}>
            <strong>1.248</strong>
            <span className="rounded-full bg-emerald-50 px-2 py-1">
              <b className="font-semibold text-emerald-700">+12%</b>
            </span>
          </div>
          <p className="mt-1 text-xs text-wisen-texto-suave">em relação ao mês anterior</p>
        </div>
      </CartaoMetrica>

      <CartaoMetrica
        titulo="Processamentos locais"
        detalhe={
          <LinhaTendencia caminho="M 0 16 Q 20 12, 40 14 T 80 6 T 100 8" cor="currentColor" />
        }
      >
        <div className={cards.value}>
          <strong>892</strong>
          <span>72% do total</span>
        </div>
      </CartaoMetrica>

      <CartaoMetrica
        titulo="Chamadas a APIs externas"
        detalhe={<LinhaTendencia caminho="M 0 18 Q 30 15, 60 8 T 100 3" cor="#d4ad2b" />}
      >
        <div className={cards.value}>
          <strong>356</strong>
          <span>28% do total</span>
        </div>
      </CartaoMetrica>
    </section>
  );
}
