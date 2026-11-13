"use client";

import { useEffect, useState } from "react";
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
      <div role="alert" className="min-h-screen bg-[#F0F4F9] p-8 text-[#101A40]">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setVersion((value) => value + 1)}
          className="mt-4 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  if (mode === null)
    return (
      <p role="status" className="min-h-screen bg-[#F0F4F9] p-8 text-[#101A40]">
        Carregando…
      </p>
    );
  return <DemoContext value={mode}>{mode ? demo : live}</DemoContext>;
}
