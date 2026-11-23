"use client";

import { ArrowDownWideNarrow, X } from "lucide-react";
import Link from "next/link";
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

const topics = ["Economia", "Meio ambiente", "Tecnologia"];
const filterItemClassName =
  "data-[highlighted]:bg-[#F3E69A] data-[highlighted]:text-wisen-titulo focus:bg-[#F3E69A] focus:text-wisen-titulo";

export default function PaginaExplorar() {
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
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

  useEffect(() => {
    async function loadInterests() {
      try {
        const response = await fetch("/api/auth/profile");
        if (!response.ok) return;
        const profile = await response.json();
        setInterests(profile.preferences?.interests ?? []);
      } catch {
        setInterests([]);
      } finally {
        setLoadingInterests(false);
      }
    }
    loadInterests();
  }, []);

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
            <p className="mb-5 text-sm text-wisen-texto-suave">
              Acompanhe as notícias do dia e descubra os conceitos por trás de cada assunto.
            </p>

            <section className="flex flex-col gap-4 wisen-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-wisen-titulo">Seus temas</h2>
                <span
                  aria-hidden="true"
                  className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]"
                />
                <p className="mt-1 text-xs leading-5 text-wisen-texto-suave">
                  {loadingInterests
                    ? "Carregando seus interesses..."
                    : interests.length
                      ? "Seus assuntos e conceitos de interesse, definidos no perfil."
                      : "Adicione assuntos de interesse no perfil para personalizar sua experiência."}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {(interests.length ? interests : topics).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-wisen-borda bg-wisen-superficie px-3 py-1.5 text-[11px] font-medium text-wisen-titulo"
                  >
                    {interest}
                  </span>
                ))}
                {!interests.length && !loadingInterests && (
                  <Link
                    href="/paginaPerfil"
                    className="text-[11px] font-medium text-[#30466E] underline underline-offset-2"
                  >
                    Ajustar perfil
                  </Link>
                )}
              </div>
            </section>

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
              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  type="button"
                  disabled={page === 1 || resource.loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </button>
                <span>Página {page}</span>
                <button
                  type="button"
                  disabled={!resource.data?.hasMore || resource.loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer variant="cliente" />
    </div>
  );
}
