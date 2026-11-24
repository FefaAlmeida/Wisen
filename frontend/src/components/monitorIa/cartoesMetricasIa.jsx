import { Activity, Globe, Server, TrendingUp, Wallet } from "lucide-react";

function CartaoMetrica({ titulo, icone: Icone, destaque = false, valor, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-wisen-borda bg-card p-4 text-wisen-titulo shadow-2xs">
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-xl ${destaque ? "bg-[#FBF5D9] text-[#795C0F]" : "bg-[#EFF3F8] text-[#30466E]"}`}
        >
          <Icone className="size-4" />
        </span>
        <h2 className="text-sm font-semibold leading-tight">{titulo}</h2>
      </header>
      <strong className="text-[clamp(1.5rem,2.4vw,2.25rem)] leading-none font-semibold tracking-tight tabular-nums whitespace-nowrap">
        {valor}
      </strong>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

export function CartoesMetricasIa() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Resumo de uso de IA">
      <CartaoMetrica titulo="Orçamento mensal" icone={Wallet} destaque valor="R$ 68,40">
        <div className="mb-2 flex justify-between gap-2 text-xs text-wisen-texto-suave">
          <span>de R$ 100,00</span>
          <span className="font-semibold text-wisen-titulo">68% usado</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-[#EFF3F8]"
          role="progressbar"
          aria-label="Orçamento mensal utilizado"
          aria-valuenow={68}
        >
          <div className="h-full w-[68%] rounded-full bg-wisen-destaque" />
        </div>
        <p className="mt-2 text-xs text-wisen-texto-suave">R$ 31,60 restantes até o limite mensal</p>
      </CartaoMetrica>

      <CartaoMetrica titulo="Requisições totais" icone={Activity} valor="1.248">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-wisen-texto-suave">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">
            <TrendingUp aria-hidden="true" className="size-3" />
            +12%
          </span>
          <span>em relação ao mês anterior</span>
        </div>
      </CartaoMetrica>

      <CartaoMetrica titulo="Processamentos locais" icone={Server} valor="892">
        <span className="inline-block rounded-full bg-[#EFF3F8] px-2.5 py-1 text-xs font-medium text-[#30466E]">
          72% do total
        </span>
      </CartaoMetrica>

      <CartaoMetrica titulo="Chamadas a APIs externas" icone={Globe} destaque valor="356">
        <span className="inline-block rounded-full bg-[#FBF5D9] px-2.5 py-1 text-xs font-medium text-[#795C0F]">
          28% do total
        </span>
      </CartaoMetrica>
    </section>
  );
}
