import { Check, Plus, Search, X } from "lucide-react";
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
  admin = false,
  categories = [],
  interests,
  onToggle,
  onSave,
  saving,
  hasChanges,
  minimumSelections = 3,
  feedback,
  showSaveControls = true,
  systemColors = false,
  embedded = false,
  onboarding = false,
}) {
  const [search, setSearch] = useState("");
  const searchTerm = normalize(search);
  const visibleTags = categories.filter((tag) => normalize(tag).includes(searchTerm));
  const selectedTags = categories.filter((tag) => interests.includes(tag));
  const canSave = new Set(interests).size >= minimumSelections;

  return (
    <Card
      className={`${embedded ? "@container/interesses gap-4 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0 [--card-spacing:0px]" : "rounded-2xl border shadow-xs"} ${
        embedded
          ? ""
          : systemColors
            ? "border-wisen-borda bg-wisen-superficie"
            : "border-slate-200/80 bg-white"
      }`}
    >
      {!embedded && (
        <CardHeader className="pb-4">
          <CardTitle
            className={`text-base font-bold ${systemColors ? "text-wisen-titulo" : "text-[#2B333F]"}`}
          >
            Interesses
          </CardTitle>
          <CardDescription
            className={`text-xs ${systemColors ? "text-wisen-texto-suave" : "text-slate-500"}`}
          >
            Escolha pelo menos {minimumSelections} áreas para acompanhar nas suas notícias e no seu
            conhecimento.
          </CardDescription>
        </CardHeader>
      )}

      <CardContent className={embedded ? "gap-4" : "space-y-4"}>
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
            className={`${embedded ? "h-11 text-sm placeholder:text-wisen-texto-suave" : "h-9 text-xs"} rounded-lg border pl-9 focus-visible:ring-wisen-destaque ${
              systemColors
                ? onboarding
                  ? "border-wisen-borda bg-white text-wisen-titulo shadow-none"
                  : "border-wisen-borda bg-wisen-superficie text-wisen-titulo"
                : "border-slate-200 bg-slate-50 text-[#2B333F]"
            }`}
          />
        </div>

        {onboarding ? (
          <div className="grid grid-cols-2 gap-2.5 @min-[28rem]/interesses:grid-cols-3 @min-[38rem]/interesses:grid-cols-4">
            {visibleTags.map((tag) => {
              const selected = interests.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={selected}
                  disabled={saving}
                  onClick={() => onToggle(tag)}
                  className={`flex min-h-12 min-w-0 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left text-[13px] leading-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7BF4D] disabled:opacity-60 ${selected ? "border-[#DCCA70] bg-[#FBF5D9] text-wisen-titulo" : "border-[#E0E6EF] bg-white text-[#526584] hover:border-[#DCCA70] hover:bg-[#FBF7E5]"}`}
                >
                  <span className="min-w-0 break-words font-medium">{tag}</span>
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#101A40] bg-[#101A40] text-[#F3E69A]" : "border-[#DCE3ED] bg-[#FAFBFD] text-[#90A0BA]"}`}
                  >
                    {selected ? (
                      <Check className="size-3" strokeWidth={2.5} />
                    ) : (
                      <Plus className="size-3" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
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
                  aria-pressed={true}
                  className={`${embedded ? "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo" : "px-3 text-xs"} inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-none py-1.5 font-semibold transition-colors ${
                    systemColors
                      ? "bg-[#F3E69A] text-wisen-titulo hover:bg-[#EBDD80]"
                      : "bg-[#F3E69A] text-[#2B333F] hover:bg-[#EBDD80]"
                  }`}
                >
                  {tag}
                  <X
                    className={`h-3 w-3 ${systemColors ? "text-wisen-titulo" : "text-[#2B333F]"}`}
                  />
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
                  aria-pressed={false}
                  className={`${embedded ? "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo" : "px-3 text-xs"} inline-flex cursor-pointer items-center gap-1.5 rounded-xl border py-1.5 font-normal transition-colors ${
                    systemColors
                      ? `border-wisen-borda bg-wisen-superficie ${embedded ? "text-wisen-titulo" : "text-wisen-texto-suave"} hover:bg-[#E6ECF4]`
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
        )}

        {embedded && visibleTags.length === 0 && (
          <p className="py-4 text-sm text-wisen-titulo">
            Nenhum tema encontrado. Tente outra busca.
          </p>
        )}

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
                {!canSave
                  ? `Selecione pelo menos ${minimumSelections} interesses (${interests.length}/${minimumSelections}).`
                  : hasChanges
                    ? "Você tem alterações pendentes."
                    : "Seus assuntos estão salvos."}
              </p>
            )}
            <Button
              type="button"
              onClick={onSave}
              disabled={!hasChanges || saving || !canSave}
              className={`h-8 rounded-lg bg-[#E8E191] px-4 text-xs font-semibold text-[#2B333F] shadow-none ${admin ? "hover:bg-wisen-admin-hover" : "hover:bg-[#d8d181]"}`}
            >
              {saving ? "Salvando..." : "Salvar interesses"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
