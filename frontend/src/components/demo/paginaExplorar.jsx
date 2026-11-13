"use client";

import { ArrowDownWideNarrow, ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarraBusca } from "@/components/barraBusca";
import { Footer } from "@/components/footer";
import { ConnectionsBackground } from "@/components/homeCliente/connectionsBackground";
import MenuPerfil from "@/components/homeCliente/menuPerfil";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { stories } from "@/data/noticiasDemo";

const topics = ["Economia", "Meio ambiente", "Tecnologia"];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function PaginaExplorar() {
  const [interests, setInterests] = useState([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [topic, setTopic] = useState("Todos os assuntos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevantes");

  function clearFilters() {
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

  const filteredStories = stories.filter((story) => {
    const matchesTopic = topic === "Todos os assuntos" || story.category === topic;
    const searchText = normalize(
      `${story.title} ${story.summary} ${story.category} ${story.concepts.join(" ")}`,
    );
    return matchesTopic && searchText.includes(normalize(search));
  });
  const visibleStories = [...filteredStories].sort((first, second) =>
    sort === "recentes" ? first.minutes - second.minutes : 0,
  );

  return (
    <div className="min-h-screen">
      <Sidebar activeItem="Explorar" />
      <main className="relative isolate min-h-screen min-w-0 bg-[radial-gradient(ellipse_at_70%_0%,#E3EAF4_0%,#F0F4F9_55%,#F0F4F9_100%)] font-[family-name:var(--font-geist-sans)] sm:ml-[128px] lg:ml-[220px]">
        <ConnectionsBackground fadeTop={false} />

        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <header className="relative z-50 flex items-center justify-end gap-3 px-4 pt-3 sm:px-5 lg:px-7">
            <div className="relative min-w-0 flex-1 sm:w-[360px] sm:flex-none">
              <BarraBusca value={search} onQueryChange={setSearch} />
            </div>
            <MenuPerfil />
          </header>

          <div className="space-y-7 px-4 pb-12 pt-7 sm:px-5 lg:px-7">
            <div>
              <p className="text-[11px] font-semibold text-[#93A3BE]">DESCOBERTA</p>
              <h1 className="mt-4 text-[36px] leading-[1.05] font-medium text-wisen-titulo sm:text-[44px]">
                Explore <span className="text-[#D7BF4D]">notícias.</span>
              </h1>
            </div>

            <section className="flex flex-col gap-4 rounded-2xl border border-wisen-borda bg-wisen-superficie p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
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
                    className="rounded-full border border-[#EBDD80] bg-[#F3E69A] px-3 py-1.5 text-[11px] font-medium text-wisen-titulo"
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
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger
                    aria-label="Filtrar por assunto"
                    className="h-9 w-[190px] rounded-full border-wisen-borda bg-white/85 text-xs text-[#344469] transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos os assuntos">Todos os assuntos</SelectItem>
                    {topics.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger
                    aria-label="Ordenar notícias"
                    className="h-9 w-[170px] rounded-full border-wisen-borda bg-white/85 text-xs text-[#344469] transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowDownWideNarrow className="size-3.5" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevantes">Mais relevantes</SelectItem>
                    <SelectItem value="recentes">Mais recentes</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="h-9 cursor-pointer gap-1.5 rounded-full border-wisen-borda bg-white/85 px-3 text-xs text-[#607092] shadow-none transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Limpar filtros
                </Button>
              </div>

              <div className="mb-3 text-xs text-[#8290A8]">
                <span>{visibleStories.length} notícias</span>
              </div>

              {visibleStories.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleStories.map((story) => (
                    <article
                      key={story.id}
                      className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E1E7F0] bg-white/95 shadow-sm"
                    >
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
                          {story.title}
                        </h2>
                        <p className="mt-2 line-clamp-3 text-[13px] leading-[18px] text-wisen-texto-suave">
                          {story.summary}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                          {story.concepts.map((concept) => (
                            <span
                              key={concept}
                              className="rounded-full bg-[#FBF7E5] px-2.5 py-1 text-[10px] text-[#52617E]"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                        <Link
                          href="/paginaEvento"
                          className="group mt-4 inline-flex cursor-pointer items-center justify-between gap-1.5 rounded-lg border-t border-[#E8ECF2] px-2 py-3 text-xs font-semibold text-[#30466E] transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo"
                        >
                          Ler notícia{" "}
                          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </article>
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
            </section>
          </div>
          <Footer variant="cliente" />
        </div>
      </main>
    </div>
  );
}
