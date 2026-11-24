"use client";

import { useState } from "react";

export function DadosGrafico({ titulo, linhas }) {
  return (
    <div className="w-48 max-w-full rounded-lg border border-wisen-borda bg-card px-3 py-2 text-xs text-wisen-titulo shadow-md">
      <div className="mb-1 font-semibold">{titulo}</div>
      <dl className="space-y-1">
        {linhas.map(({ rotulo, valor, cor }) => (
          <div key={rotulo} className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5">
              {cor && (
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: cor }}
                />
              )}
              {rotulo}
            </dt>
            <dd className="font-semibold tabular-nums">{valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ExploradorGrafico({ pontos, rotulo, inicio = 0, fim = 1, children }) {
  const [hover, setHover] = useState(null);
  const [selecao, setSelecao] = useState(null);
  const indice = hover ?? selecao;
  const ponto = pontos[indice ?? pontos.length - 1];
  const posicao = inicio + ((indice ?? 0) / (pontos.length - 1)) * (fim - inicio);

  function localizar(event) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const proporcao = ((event.clientX - left) / width - inicio) / (fim - inicio);
    return Math.round(Math.max(0, Math.min(1, proporcao)) * (pontos.length - 1));
  }

  return (
    <div className="relative isolate rounded-sm focus-within:has-[:focus-visible]:ring-2 focus-within:has-[:focus-visible]:ring-wisen-titulo">
      {children(indice)}
      <input
        className="absolute inset-0 z-10 m-0 size-full cursor-default opacity-0"
        type="range"
        min={0}
        max={pontos.length - 1}
        value={indice ?? pontos.length - 1}
        aria-label={rotulo}
        aria-valuetext={[
          ponto.titulo,
          ...ponto.linhas.map(({ rotulo, valor }) => `${rotulo}: ${valor}`),
        ].join(", ")}
        onChange={(event) => {
          setHover(null);
          setSelecao(Number(event.currentTarget.value));
        }}
        onPointerMove={(event) => {
          if (event.pointerType === "mouse") setHover(localizar(event));
        }}
        onPointerLeave={() => setHover(null)}
        onClick={(event) => {
          if (event.detail > 0) setSelecao(localizar(event));
        }}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible"))
            setSelecao(indice ?? pontos.length - 1);
        }}
        onBlur={() => setSelecao(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setHover(null);
            setSelecao(null);
          }
        }}
      />
      {indice !== null && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-full z-20 mb-2 w-48 max-w-full -translate-x-1/2"
          style={{ left: `clamp(min(6rem, 50%), ${posicao * 100}%, max(calc(100% - 6rem), 50%))` }}
        >
          <DadosGrafico {...ponto} />
        </div>
      )}
    </div>
  );
}
