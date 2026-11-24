"use client";

import {
  SegmentedButton,
  segmentCountStyle,
  segmentListStyle,
} from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conceitos } from "@/data/conceitos";
import { coresStatusConceito } from "@/lib/coresStatusConceito";

const filtros = [
  { id: "todos", rotulo: "Todas", status: null },
  { id: "lacunas", rotulo: "Minhas lacunas", status: "Lacuna" },
  { id: "revisao", rotulo: "Em revisão", status: "Em revisão" },
  { id: "dominados", rotulo: "Dominados", status: "Dominado" },
];
const itemOrdenacaoClassName =
  "data-[highlighted]:bg-[#F3E69A] data-[highlighted]:text-wisen-titulo focus:bg-[#F3E69A] focus:text-wisen-titulo";

export function FiltrosBiblioteca({ filtroAtivo, onFiltroChange, items = conceitos }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4">
      {/* Filtros */}
      <fieldset className={segmentListStyle}>
        <legend className="sr-only">Filtrar conceitos</legend>
        {filtros.map((filtro) => {
          const quantidade = filtro.status
            ? items.filter((conceito) => conceito.status === filtro.status).length
            : items.length;
          const ativo = filtro.id === filtroAtivo;

          return (
            <SegmentedButton
              key={filtro.id}
              aria-pressed={ativo}
              onClick={() => onFiltroChange(filtro.id)}
            >
              {filtro.status && (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: coresStatusConceito[filtro.status].indicador }}
                  aria-hidden="true"
                />
              )}
              {filtro.rotulo} <span className={segmentCountStyle}>{quantidade}</span>
            </SegmentedButton>
          );
        })}
      </fieldset>

      <Select defaultValue="relevantes">
        <SelectTrigger className="h-9 w-[165px] rounded-[10px] border border-[#E1E7F0] bg-[#F8FAFD] px-3 text-xs font-medium text-[#344469] shadow-none transition-colors hover:bg-[#F3E69A] hover:text-wisen-titulo focus:ring-0 [&>svg:last-child]:h-3.5 [&>svg:last-child]:w-3.5">
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
          <SelectItem className={itemOrdenacaoClassName} value="relevantes">
            Mais relevantes
          </SelectItem>
          <SelectItem className={itemOrdenacaoClassName} value="recentes">
            Mais recentes
          </SelectItem>
          <SelectItem className={itemOrdenacaoClassName} value="alfabetica">
            Ordem alfabética
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
