"use client";

import { useEffect, useState } from "react";
import { Feedback } from "@/components/app/feedback";
import { requisitar } from "@/services/api";
import { DemoContext } from "./mode";

export default function DemoPage({ demo, live }) {
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: version retries configuration loading.
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    requisitar("/account/status", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setMode(data.aiProvider === "mock");
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      });
    return () => controller.abort();
  }, [version]);

  if (error)
    return (
      <div className="min-h-screen bg-wisen-superficie p-8 text-wisen-titulo">
        <Feedback
          tone="error"
          title="Não foi possível carregar"
          description={error}
          onRetry={() => setVersion((value) => value + 1)}
        />
      </div>
    );
  if (mode === null)
    return (
      <div className="min-h-screen bg-wisen-superficie p-8 text-wisen-titulo">
        <Feedback tone="loading" title="Carregando…" description="Estamos preparando seu espaço." />
      </div>
    );
  return <DemoContext value={mode}>{mode ? demo : live}</DemoContext>;
}
