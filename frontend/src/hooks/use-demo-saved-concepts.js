"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

const changed = "wisen:saved-items";

function readSaved(key, initialItems) {
  const stored = localStorage.getItem(key);
  if (stored === null) return initialItems;
  const items = JSON.parse(stored);
  return Array.isArray(items) ? items.filter((item) => typeof item === "string") : [];
}

export function useDemoSavedConcepts() {
  return useDemoSavedItems("concepts");
}

const initialNews = ["geleiras"];
const empty = [];

export function useDemoSavedItems(collection, enabled = true) {
  const initialItems = collection === "news" ? initialNews : empty;
  const [key, setKey] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    requisitar("/auth/profile", { signal: controller.signal })
      .then((profile) => {
        if (controller.signal.aborted) return;
        if (!profile.user?.id) throw new Error("Não foi possível identificar sua conta.");
        const storageKey = `wisen:demo:saved-${collection}:${profile.user.id}`;
        setItems(readSaved(storageKey, initialItems));
        setKey(storageKey);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Não foi possível carregar seus itens salvos.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [collection, enabled, initialItems]);

  useEffect(() => {
    if (!key) return;
    function refresh(event) {
      if (event.type === "storage" && event.key !== key && event.key !== null) return;
      try {
        setItems(readSaved(key, initialItems));
      } catch {
        setError("Não foi possível carregar seus itens salvos.");
      }
    }
    window.addEventListener(changed, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(changed, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [initialItems, key]);

  function setSaved(name, value) {
    if (!key) return;
    try {
      const current = readSaved(key, initialItems);
      const wasSaved = current.includes(name);
      const willSave = value ?? !wasSaved;
      if (willSave === wasSaved) return;
      const next = willSave ? [name, ...current] : current.filter((item) => item !== name);
      localStorage.setItem(key, JSON.stringify(next));
      setItems(next);
      setError("");
      window.dispatchEvent(new Event(changed));
    } catch {
      toast.error("Não foi possível atualizar seus itens salvos. Tente novamente.");
    }
  }

  return { items, loading, error, setSaved, toggle: (name) => setSaved(name), ready: !!key };
}
