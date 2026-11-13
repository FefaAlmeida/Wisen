"use client";

import { ArrowUpRight, BookOpen, Search, SearchX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDemoMode } from "@/components/demo/mode";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { conceitos } from "@/data/conceitos";
import { stories } from "@/data/noticiasDemo";
import { requisitar } from "@/services/api";
import styles from "./barraBusca.module.css";

const filters = ["Todos", "Notícias", "Conceitos", "Artigos"];
const normalize = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

function contentItems(data) {
  return [
    ...(data.events ?? data.items ?? []).map((item) => ({
      ...item,
      type: "Notícias",
      href: `/paginaEvento?id=${encodeURIComponent(item.id)}`,
    })),
    ...(data.concepts ?? []).map((item) => ({
      ...item,
      title: item.name,
      summary: item.description,
      type: "Conceitos",
      href: `/paginaConceito?id=${encodeURIComponent(item.id)}`,
    })),
    ...(data.articles ?? []).map((item) => ({
      ...item,
      type: "Artigos",
      href: `/artigo?id=${encodeURIComponent(item.id)}`,
    })),
  ];
}

const demoItems = [
  ...stories.map((item) => ({ ...item, type: "Notícias", href: "/paginaEvento" })),
  ...conceitos.map((item) => ({
    id: item.titulo,
    title: item.titulo,
    summary: item.descricao,
    category: item.categoria,
    type: "Conceitos",
    href: "/paginaConceito",
  })),
];

export function BarraBusca({ onQueryChange, value }) {
  const demo = useDemoMode();
  const [open, setOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const query = value ?? internalQuery;
  const [filter, setFilter] = useState("Todos");
  const [resource, setResource] = useState({ items: [], loading: false, error: "" });
  const [retry, setRetry] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const triggerRef = useRef(null);
  const term = query.trim();

  useEffect(() => {
    function shortcut(event) {
      const editable =
        event.target instanceof Element &&
        event.target.closest("input, textarea, select, [contenteditable='true']");
      if (event.defaultPrevented || document.querySelector('[role="dialog"]')) return;
      if (
        (event.key === "/" && !editable) ||
        ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")
      ) {
        event.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: retry explicitly reloads failed requests.
  useEffect(() => {
    if (!open || demo) return;
    if (term.length === 1) {
      setResource({ items: [], loading: false, error: "" });
      return;
    }
    const controller = new AbortController();
    setResource({ items: [], loading: true, error: "" });
    const timer = setTimeout(
      async () => {
        try {
          const data = await requisitar(
            term ? `/discover?q=${encodeURIComponent(term)}` : "/feed?order=recent&page=1",
            { signal: controller.signal },
          );
          if (!controller.signal.aborted)
            setResource({ items: contentItems(data), loading: false, error: "" });
        } catch (error) {
          if (!controller.signal.aborted)
            setResource({ items: [], loading: false, error: error.message });
        }
      },
      term ? 250 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, demo, term, retry]);

  function changeQuery(next) {
    if (value === undefined) setInternalQuery(next);
    onQueryChange?.(next);
  }

  const items = (demo ? demoItems : resource.items).filter(
    (item) =>
      (filter === "Todos" || item.type === filter) &&
      (!demo ||
        normalize(
          `${item.title} ${item.summary} ${item.category} ${(item.concepts ?? []).join(" ")}`,
        ).includes(normalize(term))),
  );
  const visibleItems = term ? items : items.slice(0, 3);
  const loading = !demo && resource.loading;
  const error = !demo && resource.error;
  const needsMore = !demo && term.length === 1;

  function navigateResults(event) {
    const links = Array.from(resultsRef.current?.querySelectorAll("a") ?? []);
    if (!links.length) return;
    const index = links.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        index === -1
          ? event.key === "ArrowDown"
            ? 0
            : links.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
      links[next].focus();
    } else if (event.key === "Enter" && event.target === inputRef.current) {
      event.preventDefault();
      links[0].click();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger ref={triggerRef} className={styles.trigger}>
        <Search size={16} aria-hidden="true" />
        <span>Buscar no Wisen</span>
        <kbd>/</kbd>
      </DialogTrigger>
      <DialogContent
        className={styles.dialog}
        showCloseButton={false}
        initialFocus={inputRef}
        finalFocus={triggerRef}
      >
        <DialogClose className={styles.close} aria-label="Fechar busca">
          <X size={19} />
        </DialogClose>
        <DialogTitle className={styles.title}>O que você quer entender hoje?</DialogTitle>
        <search>
          <div className={styles.field}>
            <Search size={22} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              aria-label="Buscar no Wisen"
              placeholder="Qual notícia ou conceito você está procurando?"
              value={query}
              maxLength={200}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => changeQuery(event.target.value)}
              onKeyDown={navigateResults}
            />
            {query && (
              <button
                type="button"
                aria-label="Limpar busca"
                onClick={() => {
                  changeQuery("");
                  inputRef.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <fieldset className={styles.filters} aria-label="Tipos de conteúdo">
            {filters.map((label) => (
              <button
                key={label}
                type="button"
                aria-pressed={filter === label}
                onClick={() => setFilter(label)}
              >
                {label}
              </button>
            ))}
          </fieldset>
          <div className={styles.resultsHeading}>
            <h3>{term ? "Resultados" : "Conteúdos recentes"}</h3>
            <span role="status" aria-live="polite">
              {loading
                ? "Buscando…"
                : error
                  ? "Não foi possível carregar"
                  : needsMore
                    ? "Digite pelo menos 2 caracteres"
                    : term
                      ? `${items.length} ${items.length === 1 ? "resultado encontrado" : "resultados encontrados"}`
                      : ""}
            </span>
          </div>
          <div
            ref={resultsRef}
            className={term ? styles.results : styles.suggestions}
            aria-busy={loading}
          >
            {!loading &&
              !error &&
              !needsMore &&
              visibleItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.href}
                  className={styles.result}
                  onKeyDown={navigateResults}
                  onClick={() => setOpen(false)}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={540}
                      height={240}
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.paper}>
                      <BookOpen size={28} aria-hidden="true" />
                      <span>{item.summary || item.title}</span>
                    </div>
                  )}
                  <div className={styles.copy}>
                    <div className={styles.meta}>
                      <span>
                        {item.type === "Notícias"
                          ? "Notícia"
                          : item.type === "Conceitos"
                            ? "Conceito"
                            : "Artigo"}
                      </span>
                      <span>
                        {item.category ||
                          (item.updated_at
                            ? new Date(item.updated_at).toLocaleDateString("pt-BR")
                            : "Wisen")}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    {term && item.summary && <p>{item.summary}</p>}
                  </div>
                  <ArrowUpRight size={18} className={styles.arrow} aria-hidden="true" />
                </Link>
              ))}
          </div>
          {!loading && (error || (!visibleItems.length && !needsMore)) && (
            <div className={styles.empty}>
              <SearchX size={28} aria-hidden="true" />
              <h3>{error ? "Não foi possível buscar agora." : "Nenhum conteúdo encontrado."}</h3>
              <p>{error || "Tente outra palavra ou escolha um tipo diferente."}</p>
              <button
                type="button"
                onClick={() => {
                  if (error) setRetry((count) => count + 1);
                  else {
                    changeQuery("");
                    setFilter("Todos");
                  }
                }}
              >
                {error ? "Tentar novamente" : "Limpar busca e filtros"}
              </button>
            </div>
          )}
        </search>
      </DialogContent>
    </Dialog>
  );
}
