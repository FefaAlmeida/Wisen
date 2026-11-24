"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { artigosNaoAssociadosIniciais, eventosIniciais } from "@/data/curadoriaDemo";
import { applyCurationAction } from "@/lib/event-curation";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

const storageKey = "wisen:curadoria:v2";
const initialDemo = { events: eventosIniciais, unassociated: artigosNaoAssociadosIniciais };
const date = (value) => (value ? new Date(value).toLocaleDateString("pt-BR") : "Sem data");
function normalize(data) {
  const article = (item) => ({
    id: item.id,
    titulo: item.title,
    fonte: item.source,
    data: date(item.published_at),
    url: /^https?:\/\//i.test(item.url || "") ? item.url : null,
    categoria: item.topics?.[0] || "Sem categoria",
  });
  return {
    events: data.events.map((item) => ({
      id: item.id,
      titulo: item.title,
      descricao: item.summary || "",
      resumo: item.summary || "",
      categoria: item.topics?.[0] || "Sem categoria",
      status: item.curated ? "Revisado" : "Pendente",
      data: date(item.started_at),
      artigos: item.articles.map(article),
    })),
    unassociated: data.unassociated.map(article),
  };
}
function validDemo(data) {
  return (
    Array.isArray(data?.events) &&
    Array.isArray(data?.unassociated) &&
    data.events.every(
      (event) =>
        event.id != null &&
        typeof event.titulo === "string" &&
        typeof event.resumo === "string" &&
        Array.isArray(event.artigos) &&
        event.artigos.every((article) => article.id != null && typeof article.titulo === "string"),
    ) &&
    data.unassociated.every((article) => article.id != null && typeof article.titulo === "string")
  );
}
export function useEventCuration(demo) {
  const [data, setData] = useState(demo ? initialDemo : { events: [], unassociated: [] });
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const reload = useCallback(
    async (signal) => {
      setError("");
      setLoading(true);
      try {
        if (demo) {
          const saved = localStorage.getItem(storageKey);
          const parsed = saved ? JSON.parse(saved) : initialDemo;
          if (!validDemo(parsed)) throw new Error("Os dados de demonstração salvos são inválidos.");
          setData(parsed);
        } else setData(normalize(await requisitar("/admin/curation", { signal })));
        if (!signal?.aborted) setLoaded(true);
      } catch (failure) {
        if (!signal?.aborted) setError(failure.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [demo],
  );
  useEffect(() => {
    const controller = new AbortController();
    reload(controller.signal);
    return () => controller.abort();
  }, [reload]);
  async function dispatch(action) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const next = applyCurationAction(data, action);
      if (demo) {
        localStorage.setItem(storageKey, JSON.stringify(next));
        setData(next);
      } else {
        let body;
        if (action.type === "approve" || action.type === "edit") {
          const event = data.events.find((item) => item.id === action.id);
          const values = action.type === "edit" ? action.values : event;
          body = {
            action: "event",
            id: action.id,
            title: values.titulo,
            summary: values.resumo,
            category: values.categoria,
            reviewed: action.type === "approve",
          };
        } else if (action.type === "move")
          body = { action: "move", id: action.article.id, targetId: action.targetId };
        else if (action.type === "remove") body = { action: "unassign", id: action.article.id };
        else if (action.type === "merge")
          body = { action: "merge", id: action.sourceId, targetId: action.targetId };
        await requisitar("/admin/actions", { method: "POST", body });
        setData(next);
        try {
          setData(normalize(await requisitar("/admin/curation")));
        } catch {
          setError(
            "Alteração salva. Não foi possível atualizar a fila; recarregue a página para conferir os dados mais recentes.",
          );
        }
      }
      return true;
    } catch (failure) {
      toast.error(
        demo
          ? "Não foi possível salvar a alteração neste navegador. Verifique se o armazenamento está disponível e tente novamente."
          : failure.message || "Não foi possível salvar a alteração.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { ...data, loading, loaded, error, busy, reload, dispatch };
}
