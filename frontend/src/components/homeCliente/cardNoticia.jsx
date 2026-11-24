"use client";

import { Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/lib/toast";
import { requisitar } from "@/services/api";

export default function CardNoticia({ item, onDismiss }) {
  const [dismissing, setDismissing] = useState(false);
  const story = {
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.topics?.[0] ?? "Notícias",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
    source: `${item.source_count ?? 0} fonte(s)`,
    age: new Date(item.updated_at).toLocaleDateString("pt-BR"),
    concepts: [
      ...(item.recommendation_reason ? [item.recommendation_reason] : []),
      ...(item.updated ? ["Atualizada"] : []),
      ...(item.reading_status === "read"
        ? ["Lido"]
        : item.reading_status === "reading"
          ? ["Continuar lendo"]
          : []),
    ],
  };

  async function dismiss() {
    if (dismissing) return;
    setDismissing(true);
    try {
      await requisitar("/feed/interactions", {
        method: "POST",
        body: { eventId: item.id, type: "dismiss", requestId: crypto.randomUUID() },
      });
      onDismiss();
    } catch {
      toast.error("Falha ao salvar preferência. Tente novamente.");
    } finally {
      setDismissing(false);
    }
  }

  return (
    <article className="relative isolate flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-wisen-borda bg-card shadow-sm transition-colors duration-300 hover:bg-[#F0F3F8] hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none">
      <div className="relative h-40 shrink-0 overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-[#30466E]">
          {story.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] text-[#94A2B9]">
          <span>{story.source}</span>
          <span>{story.age}</span>
        </div>
        <h2 className="text-base font-semibold leading-5 text-wisen-titulo">
          <Link
            href={`/paginaEvento?id=${story.id}`}
            data-wisen-hover="preserve"
            className="no-underline after:absolute after:inset-0"
          >
            {story.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-xs leading-[18px] text-wisen-texto-suave">
          {story.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {story.concepts.map((concept) => (
            <span
              key={concept}
              className="rounded-[10px] bg-[#FBF7E5] px-3 py-1 text-[11px] text-[#75683B]"
            >
              {concept}
            </span>
          ))}
        </div>
        <button
          type="button"
          data-wisen-hover="preserve"
          className="relative z-10 mt-4 inline-flex cursor-pointer items-center gap-1.5 self-start rounded-full px-4 py-2.5 text-left text-[11px] text-wisen-texto-suave no-underline transition-colors hover:bg-[#ECEEF2] hover:text-[#485878] disabled:cursor-wait disabled:opacity-60"
          disabled={dismissing}
          onClick={dismiss}
        >
          <Ban aria-hidden="true" className="size-3.5" />
          Não tenho interesse
        </button>
      </div>
    </article>
  );
}
