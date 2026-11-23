"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeroHome from "@/components/homeCliente/heroHome";
import { InitialInterestDialog } from "@/components/homeCliente/initialInterestDialog";
import SemanticResults from "./semantic";
import { AccountNotice, EventList, Frame, Panel, State, useResource } from "./shared";
export default function Feed({ explore = false }) {
  const initialQuery = (useSearchParams()?.get("q") ?? "").slice(0, 200);
  const [topic, setTopic] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const categories = useResource("/categories");
  const [order, setOrder] = useState("personalized");
  const [query, setQuery] = useState(initialQuery);
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const session = useRef(null);
  const sessionKey = `${order}|${topic}`;
  if (session.current?.key !== sessionKey) session.current = { key: sessionKey, id: null };
  useEffect(() => {
    setQuery(initialQuery);
    setSearch(initialQuery);
    setPage(1);
  }, [initialQuery]);
  const resource = useResource(
    search
      ? `/discover?q=${encodeURIComponent(search)}`
      : `/feed?order=${order}&page=${page}&topic=${encodeURIComponent(topic)}${session.current.id ? `&sessionId=${session.current.id}` : ""}`,
  );
  useEffect(() => {
    if (resource.data?.sessionId) session.current.id = resource.data.sessionId;
  }, [resource.data]);
  return (
    <Frame
      title={explore ? "Notícias" : undefined}
      active={explore ? "Notícias" : "Início"}
      pageSearch={pageSearch}
      onPageSearchChange={setPageSearch}
    >
      {!explore && <InitialInterestDialog />}
      {!explore && (
        <div className="mb-7">
          <HeroHome />
        </div>
      )}
      <AccountNotice />
      {explore && (
        <p className="mb-5 text-sm text-wisen-texto-suave">
          Acompanhe as notícias do dia e descubra os conceitos por trás de cada assunto.
        </p>
      )}
      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(query);
            setPage(1);
          }}
          className="mb-6 flex flex-wrap gap-3"
        >
          <input
            aria-label="Buscar notícias, conceitos ou temas"
            className="min-w-0 flex-1 rounded-lg border p-3"
            value={query}
            minLength={2}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque eventos, conceitos ou instituições"
          />
          <button type="submit" className="rounded-lg bg-[#101A40] px-5 py-3 text-white">
            Buscar
          </button>
          <select
            aria-label="Ordenar notícias"
            className="rounded-lg border p-3"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setSearch("");
              setPage(1);
            }}
          >
            <option value="personalized">Mais relevantes</option>
            <option value="recent">Mais recentes</option>
          </select>
          <label className="sr-only" htmlFor="assunto-explorar">
            Filtrar por assunto
          </label>
          <select
            id="assunto-explorar"
            value={topic}
            className="rounded-lg border p-3"
            onChange={(e) => {
              setTopic(e.target.value);
              setSearch("");
              setPage(1);
            }}
          >
            <option value="">Todos os assuntos</option>
            {categories.data?.categories?.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-lg border px-4 py-3 text-sm"
            onClick={() => {
              setQuery("");
              setSearch("");
              setTopic("");
              setOrder("personalized");
              setPage(1);
              setPageSearch("");
            }}
          >
            Limpar filtros
          </button>
        </form>
        <State resource={resource}>
          <p className="mb-4 text-sm text-[#65748B]">
            {(resource.data?.events ?? resource.data?.items ?? []).length} eventos nesta página
          </p>
          <EventList items={resource.data?.events ?? resource.data?.items} />
          {search && (
            <>
              {search.length >= 3 && <SemanticResults query={search} />}
              <h2 className="mt-8 text-xl font-semibold">Conceitos</h2>
              {resource.data?.concepts?.map((c) => (
                <p key={c.id} className="mt-3">
                  <Link href={`/paginaConceito?id=${c.id}`}>{c.name}</Link>
                </p>
              ))}
              <h2 className="mt-8 text-xl font-semibold">Artigos</h2>
              {resource.data?.articles?.map((a) => (
                <p key={a.id} className="mt-3">
                  <Link href={`/artigo?id=${a.id}`}>{a.title}</Link>
                </p>
              ))}
              <h2 className="mt-8 text-xl font-semibold">Instituições e pessoas</h2>
              {resource.data?.entities?.map((n) => (
                <p key={n.id} className="mt-3">
                  {n.name} — {n.description}
                </p>
              ))}
            </>
          )}
        </State>
        {!search && (
          <div className="mt-6 flex justify-between">
            <button type="button" disabled={page === 1} onClick={() => setPage((v) => v - 1)}>
              Anterior
            </button>
            <span>Página {page}</span>
            <button
              type="button"
              disabled={!resource.data?.hasMore}
              onClick={() => setPage((v) => v + 1)}
            >
              Próxima
            </button>
          </div>
        )}
      </Panel>
      <Link href="/paginaRevisoes" className="mr-6 underline">
        Suas revisões
      </Link>
      <Link href="/paginaGuardados" className="underline">
        Conteúdos salvos
      </Link>
    </Frame>
  );
}
