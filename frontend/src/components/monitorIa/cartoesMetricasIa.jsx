import { Activity, Globe, Server, TrendingUp, Wallet } from "lucide-react";

function CartaoMetrica({ titulo, icone: Icone, valor, complemento, destaque = false, children }) {
  return (
    <div className="min-w-0 rounded-2xl border border-wisen-borda bg-card p-5 text-wisen-titulo">
      <header className="mb-3 flex items-center gap-2 text-wisen-texto-suave">
        <span
          aria-hidden="true"
          className={`grid size-8 shrink-0 place-items-center rounded-lg ${destaque ? "bg-[#FBF5D9] text-[#795C0F]" : "bg-wisen-superficie text-[#30466E]"}`}
        >
          <Icone className="size-[18px]" />
        </span>
        <h2 className="font-medium text-sm leading-5">{titulo}</h2>
      </header>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <strong className="whitespace-nowrap font-semibold text-3xl tabular-nums leading-none tracking-tight @min-[70rem]:text-4xl">
          {valor}
        </strong>
        {complemento && <span className="text-wisen-texto-suave text-xs">{complemento}</span>}
      </div>
      <div className="mt-2 text-wisen-texto-suave text-sm leading-5">{children}</div>
    </div>
  );
}

export function CartoesMetricasIa() {
  return (
    <section className="@container" aria-label="Resumo de uso de IA">
      <div className="grid gap-4 @min-[29rem]:grid-cols-2 @min-[62rem]:grid-cols-4">
        <CartaoMetrica
          titulo="Orçamento mensal"
          icone={Wallet}
          valor="R$ 68,40"
          complemento="de R$ 100,00"
          destaque
        >
          <div className="flex items-center gap-2.5">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-wisen-superficie"
              role="progressbar"
              aria-label="Orçamento mensal utilizado"
              aria-valuenow={68}
            >
              <div className="h-full w-[68%] rounded-full bg-wisen-destaque" />
            </div>
            <span className="font-medium text-xs tabular-nums">68%</span>
          </div>
          <p className="mt-1">R$ 31,60 disponíveis</p>
        </CartaoMetrica>

        <CartaoMetrica titulo="Requisições" icone={Activity} valor="1.248">
          <p className="flex flex-wrap items-center gap-x-1.5">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <TrendingUp aria-hidden="true" className="size-3.5" />
              +12%
            </span>
            <span>vs. mês anterior</span>
          </p>
        </CartaoMetrica>

        <CartaoMetrica titulo="Processamento local" icone={Server} valor="892">
          <p>72% do total</p>
        </CartaoMetrica>

        <CartaoMetrica titulo="APIs externas" icone={Globe} valor="356" destaque>
          <p>28% do total</p>
        </CartaoMetrica>
      </div>
    </section>
  );
}
