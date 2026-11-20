"use client";

import { useEffect, useState } from "react";
import { requisitar } from "@/services/api";

const changed = "wisen:saved-concepts";

function readSaved(key) {
  const items = JSON.parse(localStorage.getItem(key) || "[]");
  return Array.isArray(items) ? items.filter((item) => typeof item === "string") : [];
}

export function useDemoSavedConcepts() {
  const [key, setKey] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    requisitar("/auth/profile", { signal: controller.signal })
      .then((profile) => {
        if (controller.signal.aborted) return;
        if (!profile.user?.id) throw new Error("Não foi possível identificar sua conta.");
        const storageKey = `wisen:demo:saved-concepts:${profile.user.id}`;
        setItems(readSaved(storageKey));
        setKey(storageKey);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar seus conceitos salvos.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!key) return;
    function refresh(event) {
      if (event.type === "storage" && event.key !== key && event.key !== null) return;
      try {
        setItems(readSaved(key));
      } catch {
        setError("Não foi possível carregar seus conceitos salvos.");
      }
    }
    window.addEventListener(changed, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(changed, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [key]);

  function toggle(name) {
    if (!key) return;
    try {
      const current = readSaved(key);
      const next = current.includes(name)
        ? current.filter((item) => item !== name)
        : [name, ...current];
      localStorage.setItem(key, JSON.stringify(next));
      setItems(next);
      setError("");
      window.dispatchEvent(new Event(changed));
    } catch {
      setError("Não foi possível atualizar seus conceitos salvos. Tente novamente.");
    }
  }

  return { items, loading, error, toggle, ready: !!key };
}
