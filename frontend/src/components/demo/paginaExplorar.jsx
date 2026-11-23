"use client";

import { ArrowDownWideNarrow, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppTopBar } from "@/components/app/appTopBar";
import { PageHeader } from "@/components/app/pageHeader";
import { Footer } from "@/components/footer";
import CardNoticia from "@/components/homeCliente/cardNoticia";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import { State, useResource } from "@/components/platform/shared";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewsInterests } from "./newsInterests";

const topics = ["Economia", "Meio ambiente", "Tecnologia"];
const filterItemClassName =
  "data-[highlighted]:bg-[#F3E69A] data-[highlighted]:text-wisen-titulo focus:bg-[#F3E69A] focus:text-wisen-titulo";
const paginationButtonClassName =
  "cursor-pointer rounded-lg text-xs text-wisen-titulo hover:bg-wisen-superficie hover:text-wisen-titulo disabled:text-wisen-texto-suave disabled:opacity-60";

export default function PaginaExplorar() {
  const [topic, setTopic] = useState("Todos os assuntos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevantes");

  const [page, setPage] = useState(1);
  const session = useRef(null);
  const filterKey = `${topic}|${sort}|${search}`;
  if (session.current?.key !== filterKey) session.current = { key: filterKey, id: null };
  const resource = useResource(
    `/feed?order=${sort === "recentes" ? "recent" : "personalized"}&page=${page}&topic=${encodeURIComponent(topic === "Todos os assuntos" ? "" : topic)}&q=${encodeURIComponent(search)}${session.current.id ? `&sessionId=${session.current.id}` : ""}`,
  );
  useEffect(() => {
    if (resource.data?.sessionId) session.current.id = resource.data.sessionId;
  }, [resource.data]);
  const stories = resource.data?.items ?? [];
  function clearFilters() {
    setPage(1);
    setTopic("Todos os assuntos");
    setSearch("");
    setSort("relevantes");
  }

  function refreshFeed() {
    session.current.id = null;
    setPage(1);
    resource.reload();
  }

  const visibleStories = stories;

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Notícias" />
      <main className="relative isolate min-h-screen min-w-0 pt-[76px] bg-wisen-superficie font-[family-name:var(--font-geist-sans)] sm:ml-[76px] lg:ml-[240px]">
        <ConnectionsBackground fadeTop={false} />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <AppTopBar
            value={search}
            onQueryChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />

          <div className="wisen-container space-y-7 pb-12 pt-7">
            <PageHeader eyebrow="Notícias" title="Seu feed de" highlight="notícias." />

            <NewsInterests onSaved={refreshFeed} />

            <section>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Select
                  value={topic}
                  onValueChange={(value) => {
                    setTopic(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Filtrar por assunto"
                    className="h-9 w-[190px] rounded-[10px] border-wisen-borda bg-white/85 text-xs text-[#344469] transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className={filterItemClassName} value="Todos os assuntos">
                      Todos os assuntos
                    </SelectItem>
                    {topics.map((item) => (
                      <SelectItem key={item} value={item} className={filterItemClassName}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sort}
                  onValueChange={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Ordenar notícias"
                    className="h-9 w-[170px] rounded-[10px] border-wisen-borda bg-white/85 text-xs text-[#344469] transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDownWideNarrow className="size-3.5" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className={filterItemClassName} value="relevantes">
                      Mais relevantes
                    </SelectItem>
                    <SelectItem className={filterItemClassName} value="recentes">
                      Mais recentes
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-9 cursor-pointer gap-1.5 rounded-[10px] border-wisen-borda bg-white/85 px-3 text-xs text-[#607092] shadow-none transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Limpar filtros
                </Button>
              </div>

              <div className="mb-3 text-xs text-[#8290A8]">
                <span>{visibleStories.length} notícias</span>
              </div>

              <State resource={resource}>
                {visibleStories.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleStories.map((story) => (
                      <CardNoticia key={story.id} item={story} onDismiss={resource.reload} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[#CFD8E5] bg-white/75 px-5 py-12 text-center">
                    <p className="text-sm font-semibold text-wisen-titulo">
                      Nenhuma notícia encontrada
                    </p>
                    <p className="mt-1 text-xs text-[#7182A1]">
                      Tente outro termo ou escolha um assunto diferente.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="mt-4 cursor-pointer rounded-full transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                    >
                      Limpar filtros
                    </Button>
                  </div>
                )}
              </State>
              <nav aria-label="Paginação de notícias" className="mt-8 flex justify-center">
                <div className="inline-grid grid-cols-[1fr_auto_1fr] items-center gap-1 rounded-[10px] border border-wisen-borda bg-white p-0.5 shadow-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={paginationButtonClassName}
                    disabled={page === 1 || resource.loading}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft aria-hidden="true" className="size-3.5" />
                    Anterior
                  </Button>
                  <span
                    aria-current="page"
                    aria-live="polite"
                    className="inline-flex h-8 items-center rounded-lg bg-[#F3E69A] px-2.5 text-xs font-semibold whitespace-nowrap text-wisen-titulo tabular-nums"
                  >
                    Página {page}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={paginationButtonClassName}
                    disabled={!resource.data?.hasMore || resource.loading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                    <ChevronRight aria-hidden="true" className="size-3.5" />
                  </Button>
                </div>
              </nav>
            </section>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
