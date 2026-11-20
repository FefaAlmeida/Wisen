"use client";

import { ArrowLeft, Check, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PainelArtigos({
  evento,
  aoFechar,
  aoEditar,
  aoMover,
  aoRetirar,
  aoConfirmar,
  buscaArtigo,
  setBuscaArtigo,
  busy,
}) {
  const heading = useRef(null);
  useEffect(() => {
    if (evento?.id) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start" });
    }
  }, [evento?.id]);
  if (!evento) return null;
  const filtered = evento.artigos.filter((article) =>
    `${article.titulo} ${article.fonte}`
      .toLocaleLowerCase("pt-BR")
      .includes(buscaArtigo.toLocaleLowerCase("pt-BR")),
  );
  const reviewed = evento.status === "Revisado";
  return (
    <section
      ref={heading}
      tabIndex={-1}
      className="min-w-0 scroll-mt-40 space-y-5 outline-none sm:scroll-mt-20"
      aria-label="Revisar agrupamento"
    >
      <Button
        variant="ghost"
        onClick={aoFechar}
        disabled={busy}
        className="px-0 text-[#526584] hover:bg-wisen-admin-hover"
      >
        <ArrowLeft className="size-4" />
        Voltar à fila
      </Button>
      <header>
        <p className="mb-2 text-xs font-medium text-[#866D16]">
          {reviewed ? "Revisão concluída" : "Revisar agrupamento"}
        </p>
        <h2 className="break-words text-xl font-medium leading-snug tracking-tight text-wisen-titulo sm:text-2xl">
          {evento.titulo}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#7182A1]">
          Confira se o resumo e os artigos tratam do mesmo acontecimento antes de confirmar.
        </p>
      </header>
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 @min-[60rem]/curadoria:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)]">
        <section className="min-w-0 rounded-xl border border-wisen-borda bg-white p-4 sm:p-5">
          <h3 className="text-base font-medium text-wisen-titulo">1. Confira o acontecimento</h3>
          <span className="mt-3 inline-block rounded-full bg-[#EEF3FB] px-3 py-1 text-xs text-[#526584]">
            {evento.categoria}
          </span>
          <p className="mt-4 break-words text-sm leading-7 text-[#526584]">
            {evento.resumo ||
              "Resumo não informado. Edite as informações antes de concluir a revisão."}
          </p>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => aoEditar(evento)}
            className="mt-5 h-10 w-full whitespace-normal border-wisen-borda text-[#30466E] hover:bg-wisen-admin-hover"
          >
            Editar informações
          </Button>
        </section>
        <section className="min-w-0 overflow-hidden rounded-xl border border-wisen-borda bg-white">
          <div className="space-y-3 border-b border-[#E8EDF4] p-4 sm:p-5">
            <h3 className="text-base font-medium text-wisen-titulo">
              2. Confira os artigos ({evento.artigos.length})
            </h3>
            <p className="text-sm leading-6 text-[#7182A1]">
              Um artigo está no evento errado? Mova para outro evento ou retire para organizar
              depois.
            </p>
            <Input
              aria-label="Buscar artigos do evento"
              placeholder="Buscar por título ou fonte"
              value={buscaArtigo}
              onChange={(e) => setBuscaArtigo(e.target.value)}
              className="h-10 min-w-0 w-full"
            />
          </div>
          <div className="divide-y divide-[#E8EDF4]">
            {filtered.map((article) => (
              <article key={article.id} className="min-w-0 p-4 sm:p-5">
                <h4 className="break-words text-sm font-medium leading-6 text-wisen-titulo">
                  {article.titulo}
                </h4>
                <p className="mt-1 break-words text-xs leading-5 text-[#7182A1]">
                  {article.fonte} · {article.data}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mr-auto inline-flex min-h-9 items-center gap-1.5 text-xs text-[#30466E] hover:underline"
                    >
                      Abrir fonte
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() => aoMover(article)}
                    className="border-wisen-borda text-xs text-[#30466E] hover:bg-wisen-admin-hover"
                  >
                    Mover artigo
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={busy}
                    onClick={() => aoRetirar(article)}
                    className="text-xs text-[#7182A1] hover:bg-wisen-admin-hover"
                  >
                    Retirar do evento
                  </Button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="p-5 text-sm leading-6 text-[#7182A1]">
                {evento.artigos.length
                  ? "Nenhum artigo corresponde à busca."
                  : "Este evento está sem artigos. Associe um artigo pela fila de artigos sem evento antes de confirmar."}
              </p>
            )}
          </div>
        </section>
      </div>
      <footer className="flex min-w-0 flex-col gap-4 rounded-xl border border-[#E8DDA4] bg-[#FBF7E5] p-4 sm:p-5 @min-[42rem]/curadoria:flex-row @min-[42rem]/curadoria:items-center @min-[42rem]/curadoria:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-wisen-titulo">
            {reviewed
              ? "Este agrupamento já foi revisado."
              : "Todos os artigos tratam deste mesmo acontecimento?"}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#7182A1]">
            {reviewed
              ? "Se precisar corrigir algo, edite as informações ou organize os artigos."
              : "Confirmar marca o evento como revisado e o retira da fila de pendências."}
          </p>
        </div>
        <Button
          disabled={busy || (!reviewed && (!evento.artigos.length || !evento.resumo.trim()))}
          onClick={reviewed ? aoFechar : aoConfirmar}
          className="h-auto min-h-11 whitespace-normal bg-[#101A40] px-5 py-3 text-white hover:bg-[#30466E]"
        >
          <Check className="size-4" />
          {busy ? "Salvando..." : reviewed ? "Voltar à fila" : "Confirmar agrupamento"}
        </Button>
      </footer>
    </section>
  );
}
