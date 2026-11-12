import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function InterestsCard({
  categories = [],
  interests,
  onToggle,
  onSave,
  saving,
  hasChanges,
  minimumSelections = 1,
  feedback,
  showSaveControls = true,
  systemColors = false,
}) {
  const [search, setSearch] = useState("");
  const searchTerm = normalize(search);
  const visibleTags = categories.filter((tag) => normalize(tag).includes(searchTerm));
  const selectedTags = categories.filter((tag) => interests.includes(tag));
  const canSave = interests.length >= minimumSelections;

  return (
    <Card
      className={`rounded-2xl border shadow-xs ${
        systemColors ? "border-wisen-borda bg-wisen-superficie" : "border-slate-200/80 bg-white"
      }`}
    >
      <CardHeader className="pb-4">
        <CardTitle
          className={`text-base font-bold ${systemColors ? "text-wisen-titulo" : "text-[#2B333F]"}`}
        >
          Interesses
        </CardTitle>
        <CardDescription
          className={`text-xs ${systemColors ? "text-wisen-texto-suave" : "text-slate-500"}`}
        >
          Escolha os temas que quer ver nas suas notícias.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campo de Busca */}
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              systemColors ? "text-wisen-texto-suave" : "text-slate-400"
            }`}
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar temas..."
            aria-label="Buscar temas de interesse"
            className={`h-9 rounded-lg border pl-9 text-xs focus-visible:ring-wisen-destaque ${
              systemColors
                ? "border-wisen-borda bg-wisen-superficie text-wisen-titulo"
                : "border-slate-200 bg-slate-50 text-[#2B333F]"
            }`}
          />
        </div>

        {/* Lista de Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {/* Tags Selecionadas */}
          {selectedTags
            .filter((tag) => normalize(tag).includes(searchTerm))
            .map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => onToggle(tag)}
                disabled={saving}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-none px-3 py-1.5 text-xs font-semibold transition-colors ${
                  systemColors
                    ? "bg-[#F3E69A] text-wisen-titulo hover:bg-[#EBDD80]"
                    : "bg-[#F3E69A] text-[#2B333F] hover:bg-[#EBDD80]"
                }`}
              >
                {tag}
                <X className={`h-3 w-3 ${systemColors ? "text-wisen-titulo" : "text-[#2B333F]"}`} />
              </button>
            ))}

          {/* Tags Disponíveis */}
          {visibleTags
            .filter((tag) => !interests.includes(tag))
            .map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => onToggle(tag)}
                disabled={saving}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-normal transition-colors ${
                  systemColors
                    ? "border-wisen-borda bg-wisen-superficie text-wisen-texto-suave hover:bg-[#E6ECF4]"
                    : "border-slate-200 bg-slate-50/80 text-[#2B333F]/80 hover:bg-slate-100"
                }`}
              >
                {tag}
                <Plus
                  className={`h-3 w-3 ${systemColors ? "text-wisen-texto-suave" : "text-slate-400"}`}
                />
              </button>
            ))}
        </div>

        {showSaveControls && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {feedback ? (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {feedback.text}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                {hasChanges ? "Você tem alterações pendentes." : "Seus assuntos estão salvos."}
              </p>
            )}
            <Button
              type="button"
              onClick={onSave}
              disabled={!hasChanges || saving || !canSave}
              className="h-8 rounded-lg bg-[#E8E191] px-4 text-xs font-semibold text-[#2B333F] shadow-none hover:bg-[#d8d181]"
            >
              {saving ? "Salvando..." : "Salvar interesses"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
