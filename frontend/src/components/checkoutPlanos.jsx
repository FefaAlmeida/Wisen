"use client";

import { useState } from "react";

const planos = [
  { id: "monthly", nome: "Mensal", periodo: "1 mês", preco: "R$ 14,90" },
  { id: "semiannual", nome: "Semestral", periodo: "6 meses", preco: "R$ 79,90" },
  { id: "annual", nome: "Anual", periodo: "12 meses", preco: "R$ 149,90", destaque: true },
];

export default function CheckoutPlanos() {
  const [plano, setPlano] = useState("monthly");

  return (
    <section className="space-y-4" aria-label="Escolha seu plano">
      <p className="text-sm leading-relaxed text-white/75">
        Escolha o período de acesso que combina com você.
      </p>
      <div className="grid gap-2">
        {planos.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPlano(item.id)}
            aria-pressed={plano === item.id}
            className={`flex min-h-[68px] items-center justify-between rounded-xl border px-4 text-left transition-colors ${
              plano === item.id
                ? "border-[#F2DF73] bg-[#F2DF73]/10"
                : "border-white/15 bg-[#25354E]/70 hover:border-white/35"
            }`}
          >
            <span>
              <span className="block font-semibold text-white">
                {item.nome}{item.destaque ? " · melhor valor" : ""}
              </span>
              <span className="text-xs text-white/65">Acesso por {item.periodo}</span>
            </span>
            <span className="font-semibold text-[#F2DF73]">{item.preco}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled
        className="flex h-12 w-full cursor-not-allowed items-center justify-between rounded-lg bg-[#F3E69A] px-5 font-semibold text-[#273651] opacity-80"
      >
        <span>Pagamento em breve</span>
        <span aria-hidden="true">↗</span>
      </button>
      <p className="text-center text-xs leading-relaxed text-white/60">
        A contratação online ainda está sendo preparada. Quando estiver disponível, o pagamento
        acontecerá antes da criação da conta. Nenhuma cobrança será feita nesta etapa.
      </p>
    </section>
  );
}
