"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fontesIniciais, logsIniciais } from "@/data/fontesDemo";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

const storageKey = "wisen:fontes:v1";
function normalize(items) {
  return {
    sources: items.map((item) => ({
      id: item.id,
      nome: item.name,
      url: item.feed_url,
      ativo: item.enabled,
      ultimaColeta: item.last_collected_at
        ? new Date(item.last_collected_at).toLocaleString("pt-BR")
        : "Ainda não realizada",
      frequencia: "Automática",
      erro: item.last_error,
    })),
    logs: items
      .filter((item) => item.last_error)
      .map((item) => ({
        id: item.id,
        fonte: item.name,
        erro: item.last_error,
        status: "Falha",
        data: "Último erro informado",
      })),
  };
}
export function useAdminSources(demo) {
  const [data, setData] = useState({ sources: [], logs: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const reload = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");
      try {
        if (demo) {
          const stored = localStorage.getItem(storageKey);
          const saved = stored
            ? JSON.parse(stored)
            : { sources: fontesIniciais, logs: logsIniciais };
          if (!Array.isArray(saved.sources) || !Array.isArray(saved.logs))
            throw new Error("Não foi possível ler as fontes da demonstração.");
          setData(saved);
        } else setData(normalize((await requisitar("/admin/sources", { signal })).items));
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
  async function perform(type, source) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (demo) {
        const next = {
          ...data,
          sources:
            type === "toggle"
              ? data.sources.map((item) =>
                  item.id === source.id ? { ...item, ativo: !item.ativo } : item,
                )
              : source.id != null
                ? data.sources.map((item) =>
                    item.id === source.id ? { ...item, ...source } : item,
                  )
                : [
                    ...data.sources,
                    { ...source, id: crypto.randomUUID(), ultimaColeta: "Ainda não realizada" },
                  ],
        };
        localStorage.setItem(storageKey, JSON.stringify(next));
        setData(next);
      } else {
        await requisitar("/admin/actions", {
          method: "POST",
          body:
            type === "collect"
              ? { action: "collect", id: source.id }
              : {
                  action: "source",
                  id: source.id,
                  enabled: type === "toggle" ? !source.ativo : source.ativo,
                },
        });
        try {
          setData(normalize((await requisitar("/admin/sources")).items));
        } catch {
          setError(
            "Alteração registrada. Recarregue a página para conferir as informações mais recentes.",
          );
        }
      }
      return true;
    } catch (failure) {
      toast.error(
        demo
          ? "Não foi possível salvar as fontes neste navegador. Tente novamente."
          : failure.message || "Não foi possível atualizar a fonte.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { ...data, loading, busy, error, reload, perform };
}
