import { Check, Plus, Search, Tags, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileSection, profileSaveAction } from "./profileSection";

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
  const Container = embedded ? Card : ProfileSection;

  return (
    <Container
      {...(!embedded && {
        icon: Tags,
        title: "Interesses",
        description: `Escolha pelo menos ${minimumSelections} áreas para personalizar suas notícias e seu conhecimento.`,
      })}
      className={
        embedded
          ? "@container/interesses gap-4 overflow-visible rounded-none bg-transparent py-0 shadow-none ring-0 [--card-spacing:0px]"
          : systemColors && !showSaveControls
            ? "bg-wisen-superficie"
            : undefined
      }
    >
      <CardContent className={embedded ? "gap-4" : "gap-4 px-0"}>
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
            className={`${embedded ? "h-11 text-sm placeholder:text-wisen-texto-suave" : "h-11 text-sm"} rounded-xl border pl-9 focus-visible:ring-wisen-destaque ${
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
                  className={`${embedded ? "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo" : "min-h-10 px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo"} inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-none py-1.5 font-semibold transition-colors ${
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
                  className={`${embedded ? "min-h-11 px-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo" : "min-h-10 px-3 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo"} inline-flex cursor-pointer items-center gap-1.5 rounded-xl border py-1.5 font-normal transition-colors ${
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

        {visibleTags.length === 0 && (
          <p className="py-4 text-sm text-wisen-titulo">
            Nenhum tema encontrado. Tente outra busca.
          </p>
        )}

        {showSaveControls && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-wisen-borda/70 pt-4">
            {feedback ? (
              <p
                role={feedback.type === "error" ? "alert" : "status"}
                className={`text-xs ${feedback.type === "error" ? "text-red-600" : "text-green-700"}`}
              >
                {feedback.text}
              </p>
            ) : (
              <p className="text-xs text-wisen-texto-suave">
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
              className={profileSaveAction}
            >
              {saving ? "Salvando..." : "Salvar interesses"}
            </Button>
          </div>
        )}
      </CardContent>
    </Container>
  );
}
