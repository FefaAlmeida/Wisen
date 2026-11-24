"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CardConceito } from "@/components/biblioteca/cardConceito";
import { ConceitosSalvos } from "@/components/biblioteca/conceitosSalvos";
import { FiltrosBiblioteca } from "@/components/biblioteca/filtrosBiblioteca";
import { conceitos } from "@/data/conceitos";

const filtros = {
  todos: null,
  lacunas: "Lacuna",
  revisao: "Em revisão",
  dominados: "Dominado",
};

export function CatalogoConceitos() {
  const params = useSearchParams();
  const initialFilter = params?.get("filtro");
  const [filtroAtivo, setFiltroAtivo] = useState(
    initialFilter === "salvos" || Object.hasOwn(filtros, initialFilter) ? initialFilter : "todos",
  );
  const statusFiltrado = filtros[filtroAtivo];
  const conceitosFiltrados = conceitos.filter(
    (conceito) => !statusFiltrado || conceito.status === statusFiltrado,
  );

  return (
    <>
      <section className="mb-5 w-full">
        <FiltrosBiblioteca filtroAtivo={filtroAtivo} onFiltroChange={setFiltroAtivo} />
      </section>

      {filtroAtivo === "salvos" ? (
        <ConceitosSalvos onExplore={() => setFiltroAtivo("todos")} />
      ) : (
        <section
          aria-label="Conceitos"
          className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {conceitosFiltrados.length > 0 ? (
            conceitosFiltrados.map((conceito) => (
              <CardConceito
                key={conceito.titulo}
                titulo={conceito.titulo}
                categoria={conceito.categoria}
                descricao={conceito.descricao}
                status={conceito.status}
                progresso={conceito.progresso}
              />
            ))
          ) : (
            <p className="col-span-full rounded-2xl border border-slate-200/80 bg-white p-6 text-sm text-slate-500">
              Nenhum conceito encontrado neste filtro.
            </p>
          )}
        </section>
      )}
    </>
  );
}
