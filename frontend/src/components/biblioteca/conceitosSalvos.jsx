"use client";

import { ArrowUpRight, Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDemoMode } from "@/components/demo/mode";
import { State, useResource } from "@/components/platform/shared";
import { Button } from "@/components/ui/button";
import { conceitosDetalhados, demoConceptHref } from "@/data/conceitoDetalhes";
import { useDemoSavedConcepts } from "@/hooks/use-demo-saved-concepts";
import { requisitar } from "@/services/api";

export function ConceitosSalvos() {
  return useDemoMode() ? <DemoSaved /> : <LiveSaved />;
}

function DemoSaved() {
  const saved = useDemoSavedConcepts();
  if (saved.loading)
    return (
      <p role="status" className="text-sm text-wisen-texto-suave">
        Carregando conceitos salvos…
      </p>
    );
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
    />
  );
}

function LiveSaved() {
  const resource = useResource("/saved");
  const [error, setError] = useState("");
  async function remove(id) {
    try {
      await requisitar(`/saved/${id}`, { method: "DELETE" });
      setError("");
      resource.reload();
    } catch {
      setError("Não foi possível remover o conceito. Tente novamente.");
    }
  }
  return (
    <State resource={resource}>
      <SavedList
        items={(resource.data?.items ?? [])
          .filter((item) => item.concept_id)
          .map((item) => ({
            id: item.id,
            name: item.title,
            href: `/paginaConceito?id=${item.concept_id}`,
          }))}
        onRemove={remove}
        error={error}
      />
    </State>
  );
}

function SavedList({ items, onRemove, error }) {
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
    <section className="wisen-panel p-5 sm:p-6" aria-labelledby="saved-concepts-title">
      <div className="mb-5 flex items-start gap-3">
        <Bookmark size={20} className="mt-1 shrink-0 text-[#30466e]" aria-hidden="true" />
        <div>
          <h2 id="saved-concepts-title" className="text-lg font-semibold text-wisen-titulo">
            Conceitos salvos ({items.length})
          </h2>
          <p className="mt-1 text-sm leading-6 text-wisen-texto-suave">
            Retome os assuntos que você guardou para estudar depois.
          </p>
        </div>
      </div>
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {error}
        </p>
      )}
      {items.length ? (
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
      ) : (
        !error && (
          <div className="rounded-xl border border-dashed border-wisen-borda p-6 text-center">
            <p className="text-sm font-medium text-wisen-titulo">
              Você ainda não salvou nenhum conceito.
            </p>
            <p className="mt-2 text-sm leading-6 text-wisen-texto-suave">
              Use o ícone de salvar nos conceitos de uma notícia ou o botão “Salvar conceito” na
              página do assunto.
            </p>
          </div>
        )
      )}
    </section>
  );
}
