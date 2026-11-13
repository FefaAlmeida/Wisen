"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { requisitar } from "@/services/api";
export default function SemanticResults({ query }) {
  const [state, setState] = useState({ status: "pending", items: [], error: "" });
  useEffect(() => {
    const controller = new AbortController();
    let timer;
    let attempts = 0;
    setState({ status: "pending", items: [], error: "" });
    const fail = (e) => {
      if (!controller.signal.aborted) setState({ status: "failed", items: [], error: e.message });
    };
    async function poll(id) {
      try {
        const data = await requisitar(`/search/${id}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (data.status === "completed")
          setState({ status: "completed", items: data.results ?? [], error: "" });
        else if (data.status === "failed")
          setState({ status: "failed", items: [], error: data.error ?? "Busca indisponível" });
        else if (++attempts < 40) timer = setTimeout(() => poll(id), 1500);
        else
          setState({
            status: "failed",
            items: [],
            error:
              "A busca está demorando mais que o esperado. Tente novamente em alguns instantes.",
          });
      } catch (e) {
        fail(e);
      }
    }
    requisitar("/search", { method: "POST", body: { query, limit: 12 }, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) poll(data.id);
      })
      .catch(fail);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Resultados por significado</h2>
      {state.status === "pending" && <p role="status">Buscando conteúdos relacionados…</p>}
      {state.error && <p role="status">{state.error}</p>}
      <ul className="space-y-4">
        {state.items.map((item) => (
          <li key={`${item.kind}-${item.id}`}>
            <Link
              className="font-medium underline"
              href={
                item.kind === "concept"
                  ? `/paginaConceito?id=${item.id}`
                  : item.kind === "event"
                    ? `/paginaEvento?id=${item.id}`
                    : item.kind === "entity"
                      ? `/paginaExplorar?q=${encodeURIComponent(item.title)}`
                      : `/artigo?id=${item.id}`
              }
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-[#65748B]">{item.excerpt}</p>
          </li>
        ))}
      </ul>
      {state.status === "completed" && !state.items.length && (
        <p>Nenhum conteúdo relacionado disponível.</p>
      )}
    </section>
  );
}
