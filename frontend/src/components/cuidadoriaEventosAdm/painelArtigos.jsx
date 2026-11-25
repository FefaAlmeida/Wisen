"use client";

import { ArrowLeft, Check, ExternalLink, Pencil, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { adminActionHover } from "@/components/admin/adminButtonStyles";
import { adminFilterControl } from "@/components/admin/adminTableFilter";
import { AdminZuzuPortrait } from "@/components/admin/adminZuzuPortrait";
import { Button } from "@/components/ui/button";
import { dialogPrimaryAction } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusEvento } from "./cardEvento";

const rowAction = `border-wisen-borda text-xs text-wisen-texto-forte ${adminActionHover}`;

export function ArticleSource({ url }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-wisen-texto-forte hover:bg-wisen-admin-control-hover hover:underline focus-visible:outline-2 focus-visible:outline-ring"
    >
      Abrir fonte
      <ExternalLink aria-hidden="true" className="size-3.5" />
    </a>
  );
}

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
  canMove,
}) {
  const panel = useRef(null);
  const heading = useRef(null);
  const eventId = evento.id;
  useEffect(() => {
    if (eventId != null) {
      heading.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ block: "start" });
    }
  }, [eventId]);

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");
  const query = normalize(buscaArtigo.trim());
  const filtered = evento.artigos.filter((article) =>
    normalize(`${article.titulo} ${article.fonte ?? ""}`).includes(query),
  );
  const reviewed = evento.status === "Revisado";
  const missing = !evento.artigos.length
    ? "Associe pelo menos um artigo ao evento para confirmar."
    : !evento.resumo.trim()
      ? "Preencha o resumo do evento para confirmar."
      : "";

  return (
    <section
      ref={panel}
      className="min-w-0 scroll-mt-40 space-y-4 sm:scroll-mt-24"
      aria-label="Revisar agrupamento"
    >
      <Button variant="outline" size="sm" onClick={aoFechar} disabled={busy} className={rowAction}>
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Voltar à fila
      </Button>
      <header className="wisen-panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <StatusEvento reviewed={reviewed} />
          <span className="text-xs break-words text-wisen-texto-suave">{evento.categoria}</span>
          <span className="text-xs tabular-nums text-wisen-texto-suave">{evento.data}</span>
        </div>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mt-2 text-xl font-semibold tracking-tight break-words text-wisen-titulo outline-none sm:text-2xl"
        >
          {evento.titulo}
        </h2>
      </header>
      <div className="grid min-w-0 items-start gap-4 @min-[56rem]/curadoria:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
        <section className="wisen-panel min-w-0 p-4 sm:p-5" aria-labelledby="revisao-resumo">
          <h3 id="revisao-resumo" className="text-sm font-semibold text-wisen-titulo">
            Resumo do evento
          </h3>
          <p className="mt-3 text-sm leading-6 break-words whitespace-pre-line text-wisen-texto-suave">
            {evento.resumo || "Resumo ainda não preenchido."}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => aoEditar(evento)}
            className={`mt-4 ${rowAction}`}
          >
            <Pencil aria-hidden="true" className="size-3.5" />
            Editar informações
          </Button>
        </section>
        <section className="wisen-panel overflow-hidden" aria-labelledby="revisao-artigos">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <h3 id="revisao-artigos" className="text-sm font-semibold text-wisen-titulo">
              Artigos associados ({evento.artigos.length})
            </h3>
            {evento.artigos.length > 0 && (
              <div className="relative w-full min-w-0 sm:w-56">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-wisen-texto-suave"
                />
                <Input
                  aria-label="Buscar artigos do evento"
                  placeholder="Buscar por título ou fonte"
                  value={buscaArtigo}
                  onChange={(e) => setBuscaArtigo(e.target.value)}
                  className={`${adminFilterControl} pl-9`}
                />
              </div>
            )}
          </div>
          <div className="divide-y divide-[#E8EDF4] border-t border-[#E8EDF4]">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-5"
              >
                <div className="min-w-0 flex-1 basis-48">
                  <h4 className="text-sm font-semibold leading-6 break-words text-wisen-titulo">
                    {article.titulo}
                  </h4>
                  <p className="mt-1 text-xs leading-5 break-words text-wisen-texto-suave">
                    {[article.fonte, article.data].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ArticleSource url={article.url} />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={busy || !canMove}
                    onClick={() => aoMover(article)}
                    className={rowAction}
                  >
                    Mover artigo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={busy}
                    onClick={() => aoRetirar(article)}
                    className={`text-xs text-wisen-texto-suave ${adminActionHover}`}
                  >
                    Retirar do evento
                  </Button>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-wisen-texto-suave sm:px-5">
                {evento.artigos.length
                  ? "Nenhum artigo corresponde à busca."
                  : "Nenhum artigo associado a este evento."}
              </p>
            )}
          </div>
        </section>
      </div>
      {!reviewed && (
        <footer className="wisen-panel flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            {!missing && <AdminZuzuPortrait className="size-9 shrink-0" />}
            <div>
              <h3 className="text-sm font-semibold text-wisen-titulo">Concluir revisão</h3>
              <p className="mt-1 text-sm leading-6 text-wisen-texto-suave">
                {missing || "Confirme se todos os artigos tratam do mesmo acontecimento."}
              </p>
            </div>
          </div>
          <Button
            disabled={busy || Boolean(missing)}
            onClick={aoConfirmar}
            className={dialogPrimaryAction}
          >
            <Check aria-hidden="true" className="size-4" />
            {busy ? "Salvando..." : "Confirmar agrupamento"}
          </Button>
        </footer>
      )}
    </section>
  );
}
