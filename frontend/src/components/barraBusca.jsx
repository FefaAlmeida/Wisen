"use client";

import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const allMatchesName = "wisen-page-search-matches";
const currentMatchName = "wisen-page-search-current";

function getHighlightRegistry() {
  if (typeof CSS === "undefined" || !CSS.highlights || typeof Highlight === "undefined") {
    return null;
  }
  return CSS.highlights;
}

function clearHighlights(root) {
  const registry = getHighlightRegistry();
  registry?.delete(allMatchesName);
  registry?.delete(currentMatchName);

  for (const element of root.querySelectorAll(
    "[data-wisen-page-search-match], [data-wisen-page-search-current]",
  )) {
    element.removeAttribute("data-wisen-page-search-match");
    element.removeAttribute("data-wisen-page-search-current");
  }
}

function normalizeWithOffsets(value) {
  let normalized = "";
  const starts = [];
  const ends = [];
  let offset = 0;

  for (const character of value) {
    const start = offset;
    offset += character.length;
    const folded = character
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR");

    for (const normalizedCharacter of folded) {
      normalized += normalizedCharacter;
      starts.push(start);
      ends.push(offset);
    }
  }

  return { normalized, starts, ends };
}

function findMatches(root, query) {
  const needle = normalizeWithOffsets(query).normalized;
  if (!needle) return [];

  const matches = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      if (
        parent.closest(
          "form, button, input, textarea, select, option, script, style, svg, [hidden], [aria-hidden='true'], [data-page-search-exclude]",
        )
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? "";
    const { normalized, starts, ends } = normalizeWithOffsets(text);
    let searchFrom = 0;

    while (searchFrom < normalized.length) {
      const matchStart = normalized.indexOf(needle, searchFrom);
      if (matchStart === -1) break;

      const range = document.createRange();
      range.setStart(node, starts[matchStart]);
      range.setEnd(node, ends[matchStart + needle.length - 1]);
      matches.push({
        range,
        element: node.parentElement.closest("p, li, h1, h2, h3, h4, a, blockquote") ?? node.parentElement,
      });
      searchFrom = matchStart + needle.length;
    }
  }

  return matches;
}

function applyHighlights(matches, currentIndex) {
  const registry = getHighlightRegistry();
  if (registry) {
    registry.set(allMatchesName, new Highlight(...matches.map(({ range }) => range)));
    registry.set(currentMatchName, new Highlight(matches[currentIndex].range));
    return;
  }

  for (const { element } of matches) {
    element.setAttribute("data-wisen-page-search-match", "");
    element.removeAttribute("data-wisen-page-search-current");
  }
  matches[currentIndex].element.setAttribute("data-wisen-page-search-current", "");
}

export function BarraBusca({ onQueryChange }) {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const matchesRef = useRef([]);

  useEffect(() => () => clearHighlights(document), []);

  function handleChange(event) {
    const value = event.target.value;
    clearHighlights(document);
    matchesRef.current = [];
    setQuery(value);
    setMatches([]);
    setCurrentIndex(0);
    setMessage("");
    onQueryChange?.(value);
  }

  function focusMatch(index) {
    const nextIndex = (index + matchesRef.current.length) % matchesRef.current.length;
    applyHighlights(matchesRef.current, nextIndex);
    matchesRef.current[nextIndex].element.scrollIntoView?.({
      behavior: "smooth",
      block: "center",
    });
    setCurrentIndex(nextIndex);
  }

  function handleSubmit(event) {
    event.preventDefault();
    clearHighlights(document);

    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      matchesRef.current = [];
      setMatches([]);
      setCurrentIndex(0);
      setMessage("Digite um termo para localizar nesta página.");
      return;
    }

    const root = event.currentTarget.closest("main") ?? document.body;
    const found = findMatches(root, normalizedQuery);
    matchesRef.current = found;
    setMatches(found);
    setCurrentIndex(0);
    setMessage(found.length ? "" : "Nenhuma ocorrência encontrada nesta página.");

    if (found.length) focusMatch(0);
  }

  return (
    <form className="relative w-full" role="search" onSubmit={handleSubmit}>
      <style>{`
        ::highlight(${allMatchesName}) {
          background-color: #ebdd80;
          color: #202d3a;
        }
        ::highlight(${currentMatchName}) {
          background-color: #ebdd80;
          color: #202d3a;
        }
        [data-wisen-page-search-match] {
          background-color: #ebdd80;
          border-radius: 2px;
        }
        [data-wisen-page-search-current] {
          outline: 2px solid #ebdd80;
          border-radius: 4px;
        }
      `}</style>
      <Input
        type="search"
        value={query}
        onChange={handleChange}
        aria-label="Localizar nesta página"
        aria-describedby={message || matches.length ? "busca-pagina-status" : undefined}
        placeholder="Localizar nesta página..."
        className="h-9 rounded-full border-wisen-borda bg-white/90 pl-4 pr-10 text-[11px] shadow-sm placeholder:text-[#8794AA] focus-visible:ring-[#DCE5F2]"
      />
      <button
        type="submit"
        aria-label="Localizar"
        title="Localizar nesta página"
        className="absolute top-1/2 right-1 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#7182A1] transition-colors hover:bg-[#F0F4F9] hover:text-wisen-texto focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#EBDD80]"
      >
        <Search aria-hidden="true" size={15} />
      </button>

      {(message || matches.length > 0) && (
        <div
          id="busca-pagina-status"
          className="absolute top-full z-[60] mt-2 flex w-full items-center justify-between gap-2 rounded-xl border border-wisen-borda bg-white px-3 py-2 shadow-lg"
        >
          {message ? (
            <p role="status" className="text-xs text-[#607092]">
              {message}
            </p>
          ) : (
            <>
              <p role="status" aria-live="polite" className="text-xs text-[#607092]">
                {currentIndex + 1} de {matches.length} ocorrências
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Ocorrência anterior"
                  onClick={() => focusMatch(currentIndex - 1)}
                  className="flex size-7 items-center justify-center rounded-full text-[#607092] transition-colors hover:bg-[#F0F4F9]"
                >
                  <ArrowUp aria-hidden="true" size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Próxima ocorrência"
                  onClick={() => focusMatch(currentIndex + 1)}
                  className="flex size-7 items-center justify-center rounded-full text-[#607092] transition-colors hover:bg-[#F0F4F9]"
                >
                  <ArrowDown aria-hidden="true" size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </form>
  );
}
