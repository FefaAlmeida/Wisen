"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CircleAlert,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDemoMode } from "@/components/demo/mode";
import { useResource } from "@/components/platform/shared";
import { Button } from "@/components/ui/button";
import { conceitosDetalhados, demoConceptHref } from "@/data/conceitoDetalhes";
import { useDemoSavedConcepts } from "@/hooks/use-demo-saved-concepts";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

export function ConceitosSalvos({ onExplore }) {
  return useDemoMode() ? <DemoSaved onExplore={onExplore} /> : <LiveSaved onExplore={onExplore} />;
}

function DemoSaved({ onExplore }) {
  const saved = useDemoSavedConcepts();
  return (
    <SavedList
      items={saved.items.map((name) => ({
        id: name,
        name,
        href: demoConceptHref(name),
        description: conceitosDetalhados.find((item) => item.titulo === name)?.descricao,
      }))}
      onRemove={saved.toggle}
      error={saved.error}
      loading={saved.loading}
      onExplore={onExplore}
    />
  );
}

function LiveSaved({ onExplore }) {
  const resource = useResource("/saved");
  async function remove(id) {
    try {
      await requisitar(`/saved/${id}`, { method: "DELETE" });
      resource.reload();
    } catch {
      toast.error("Não foi possível remover o conceito. Tente novamente.");
    }
  }
  return (
    <SavedList
      items={(resource.data?.items ?? [])
        .filter((item) => item.concept_id)
        .map((item) => ({
          id: item.id,
          name: item.title,
          href: `/paginaConceito?id=${item.concept_id}`,
        }))}
      onRemove={remove}
      error={resource.error}
      loading={resource.loading}
      onRetry={resource.error ? resource.reload : undefined}
      onExplore={onExplore}
    />
  );
}

function SavedMessage({ tone = "empty", title, description, children }) {
  const isError = tone === "error";
  const isLoading = tone === "loading";
  const Icon = isError ? CircleAlert : isLoading ? LoaderCircle : Bookmark;

  return (
    <div
      data-tone={tone}
      className="group flex items-start gap-3 rounded-xl border border-wisen-borda bg-wisen-superficie/70 p-4 sm:items-center sm:gap-4 sm:p-5 data-[tone=empty]:bg-linear-to-r data-[tone=empty]:from-wisen-cliente-hover data-[tone=empty]:to-wisen-superficie/70 data-[tone=error]:border-red-200 data-[tone=error]:bg-red-50"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-wisen-texto-forte shadow-xs group-data-[tone=empty]:bg-wisen-destaque-suave group-data-[tone=error]:bg-red-100 group-data-[tone=error]:text-red-800">
        <Icon
          size={20}
          aria-hidden="true"
          className={isLoading ? "motion-safe:animate-spin" : undefined}
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-3">
        <div
          role={isError ? "alert" : "status"}
          className="min-w-0 flex-1 basis-48 wrap-break-word"
        >
          <p className="text-sm font-semibold text-wisen-titulo group-data-[tone=error]:text-red-900">
            {title}
          </p>
          {description && (
            <p className="mt-1 max-w-xl text-sm leading-5 text-wisen-texto-suave">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function SavedList({ items, onRemove, error, loading, onRetry, onExplore }) {
  const [busy, setBusy] = useState(null);
  async function remove(id) {
    setBusy(id);
    try {
      await onRemove(id);
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="wisen-panel space-y-4 p-4 sm:p-5" aria-labelledby="saved-concepts-title">
      <h2 id="saved-concepts-title" className="text-base font-semibold text-wisen-titulo">
        Conceitos salvos{items.length > 0 && ` (${items.length})`}
      </h2>
      {loading && <SavedMessage tone="loading" title="Carregando conceitos salvos…" />}
      {!loading && error && (
        <SavedMessage
          tone="error"
          title={onRetry ? "Não foi possível carregar seus conceitos salvos." : error}
        >
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          )}
        </SavedMessage>
      )}
      {items.length > 0 && (
        <ul className="divide-y divide-wisen-borda">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-4">
              <Link
                href={item.href}
                className="min-w-0 flex-1 rounded-md text-[#30466e] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  {item.name}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
                {item.description && (
                  <p className="mt-1 text-xs leading-6 text-wisen-texto-suave">
                    {item.description}
                  </p>
                )}
              </Link>
              <Button
                variant="outline"
                size="sm"
                disabled={busy !== null}
                onClick={() => remove(item.id)}
                aria-label={`Remover ${item.name} dos salvos`}
              >
                <Trash2 size={15} aria-hidden="true" />
                <span className="hidden sm:inline">Remover</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && items.length === 0 && (
        <SavedMessage
          title="Você ainda não salvou nenhum conceito."
          description="Abra um conceito e selecione “Salvar conceito” para retomá-lo depois."
        >
          {onExplore && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExplore}
              className="h-9 cursor-pointer border-wisen-borda bg-white px-3 text-wisen-titulo hover:border-wisen-destaque hover:bg-wisen-cliente-hover"
            >
              Explorar conceitos
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </SavedMessage>
      )}
    </section>
  );
}
