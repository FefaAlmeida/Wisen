"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conceitos } from "@/data/conceitos";

const filtros = [
  { id: "todos", rotulo: "Todas", status: null, cor: null },
  { id: "lacunas", rotulo: "Minhas lacunas", status: "Lacuna", cor: "bg-[#FF6469]" },
  { id: "revisao", rotulo: "Em revisão", status: "Em revisão", cor: "bg-[#FFD33D]" },
  { id: "dominados", rotulo: "Dominados", status: "Dominado", cor: "bg-[#33B27C]" },
];

export function FiltrosBiblioteca({ filtroAtivo, onFiltroChange }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      {/* Filtros */}
      <fieldset className="flex flex-wrap items-center gap-2.5 border-0 p-0">
        <legend className="sr-only">Filtrar conceitos por status</legend>
        {filtros.map((filtro) => {
          const quantidade = filtro.status
            ? conceitos.filter((conceito) => conceito.status === filtro.status).length
            : conceitos.length;
          const ativo = filtro.id === filtroAtivo;

          return (
            <Button
              key={filtro.id}
              type="button"
              size="sm"
              variant={ativo ? "default" : "outline"}
              aria-pressed={ativo}
              onClick={() => onFiltroChange(filtro.id)}
              className={
                ativo
                  ? "h-9 rounded-full border-0 bg-wisen-destaque-suave px-5 text-[13px] font-medium text-wisen-texto shadow-none hover:bg-[#F1E18A]"
                  : "h-9 rounded-full border-wisen-borda bg-white/80 px-4 text-[13px] font-normal text-[#607092] shadow-none hover:bg-white hover:text-wisen-texto"
              }
            >
              {filtro.cor && <span className={`mr-2 h-2 w-2 rounded-full ${filtro.cor}`} />}
              {filtro.rotulo} ({quantidade})
            </Button>
          );
        })}
      </fieldset>

      <Select defaultValue="relevantes">
        <SelectTrigger className="h-9 w-[165px] rounded-full border border-[#E1E7F0] bg-[#F8FAFD] px-3 text-xs font-medium text-[#344469] shadow-none focus:ring-0 [&>svg:last-child]:h-3.5 [&>svg:last-child]:w-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
            >
              <path d="M4 7h16M4 17h16" />
              <path d="M9 4v6M15 14v6" />
            </svg>

            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="relevantes">Mais relevantes</SelectItem>
          <SelectItem value="recentes">Mais recentes</SelectItem>
          <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
