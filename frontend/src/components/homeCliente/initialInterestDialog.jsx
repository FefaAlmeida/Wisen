"use client";

import { useEffect, useRef, useState } from "react";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { requisitar } from "@/services/api";

const MINIMUM_INTERESTS = 3;

async function readResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export function InitialInterestDialog() {
  const dialogRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(0);
  const [familiarity, setFamiliarity] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const [response, categoryData] = await Promise.all([
          fetch("/api/auth/profile", {
            credentials: "same-origin",
            cache: "no-store",
          }),
          requisitar("/categories"),
        ]);
        const data = await readResponse(response);
        if (!response.ok) {
          throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
        }
        const availableCategories = categoryData.categories?.map((category) => category.name);
        if (!Array.isArray(availableCategories)) {
          throw new Error("A resposta de categorias não contém uma lista válida.");
        }
        const savedInterests = data.preferences?.interests;
        if (!Array.isArray(savedInterests)) {
          throw new Error("A resposta do perfil não contém uma lista de interesses válida.");
        }
        const selectedInterests = savedInterests.filter((interest) =>
          availableCategories.includes(interest),
        );
        const onboardingCompleted =
          typeof data.preferences.onboardingCompleted === "boolean"
            ? data.preferences.onboardingCompleted
            : selectedInterests.length >= MINIMUM_INTERESTS;
        if (active) {
          setProfile(data);
          setCategories(availableCategories);
          setInterests(selectedInterests);
          setFamiliarity(data.preferences.familiarity ?? "");
          setOpen(!onboardingCompleted || selectedInterests.length < MINIMUM_INTERESTS);
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Não foi possível carregar seu perfil.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
    setError("");
  }

  async function completeOnboarding(skipFamiliarity = false) {
    if (!profile || saving) return;
    if (new Set(interests).size < MINIMUM_INTERESTS) {
      setError("Escolha pelo menos 3 áreas de interesse para continuar.");
      setStep(0);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          ...(!skipFamiliarity && familiarity ? { familiarity } : {}),
          onboardingCompleted: true,
        }),
      });
      const data = await readResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
      }

      setOpen(false);
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar suas preferências.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;

  if (error && !profile) {
    return (
      <div
        role="alert"
        className="fixed top-4 right-4 left-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg"
      >
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen, eventDetails) => {
        if (!nextOpen) eventDetails.cancel();
      }}
    >
      <DialogContent
        ref={dialogRef}
        initialFocus={dialogRef}
        showCloseButton={false}
        className="flex h-[min(720px,calc(100dvh-2rem))] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 text-wisen-titulo sm:max-w-3xl"
      >
        <DialogHeader className="shrink-0 gap-3 px-6 pt-6 pb-6 sm:px-10 sm:pt-8 [@media(max-height:600px)]:gap-2 [@media(max-height:600px)]:pt-4 [@media(max-height:600px)]:pb-3">
          <p role="status" className="text-sm font-medium text-wisen-titulo/70">
            Etapa {step + 1} de 2
          </p>
          <DialogTitle className="text-2xl leading-tight font-bold text-balance text-wisen-titulo sm:text-[28px] [@media(max-height:600px)]:text-xl">
            {step === 0
              ? "Quais assuntos interessam a você?"
              : "Como você se sente ao ler sobre economia?"}
          </DialogTitle>
          <DialogDescription className="max-w-prose text-sm leading-relaxed text-wisen-titulo/70">
            {step === 0
              ? "Escolha pelo menos 3 áreas para personalizar os conteúdos. Você pode alterar seus interesses depois no perfil."
              : "Sua resposta ajusta a linguagem das explicações, sem testar seu conhecimento. Você também pode pular esta pergunta."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2 sm:px-10">
          {step === 0 ? (
            <InterestsCard
              categories={categories}
              interests={interests}
              onToggle={toggleInterest}
              minimumSelections={MINIMUM_INTERESTS}
              showSaveControls={false}
              systemColors
              embedded
            />
          ) : (
            <fieldset disabled={saving} className="space-y-4">
              <legend className="sr-only">Sua familiaridade com economia</legend>
              {[
                [
                  "beginner",
                  "Estou começando",
                  "Quero conhecer os conceitos e entender as notícias.",
                ],
                [
                  "basic",
                  "Entendo o básico",
                  "Conheço alguns conceitos e quero conectar as ideias.",
                ],
                [
                  "experienced",
                  "Já acompanho economia",
                  "Leio sobre o assunto e quero aprofundar meu conhecimento.",
                ],
              ].map(([value, label, description]) => (
                <label
                  key={value}
                  className="flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-wisen-borda px-5 py-4 text-wisen-titulo transition-colors hover:bg-wisen-superficie has-[:checked]:border-wisen-titulo has-[:checked]:bg-[#F3E69A]/25 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wisen-titulo"
                >
                  <input
                    type="radio"
                    name="onboarding-familiarity"
                    className="size-4 shrink-0 accent-wisen-titulo"
                    aria-label={label}
                    value={value}
                    checked={familiarity === value}
                    onChange={() => {
                      setFamiliarity(value);
                      setError("");
                    }}
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-base font-medium">{label}</span>
                    <span className="text-sm leading-relaxed text-wisen-titulo/70">
                      {description}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}
        </div>

        {error && (
          <p role="alert" className="shrink-0 px-6 pt-3 text-sm text-red-600 sm:px-10">
            {error}
          </p>
        )}

        <DialogFooter className="mt-6 shrink-0 flex-row flex-wrap items-center gap-3 border-t border-wisen-borda px-6 py-5 sm:justify-between sm:px-10 sm:py-6 [@media(max-height:600px)]:mt-3 [@media(max-height:600px)]:py-3">
          <p
            aria-live="polite"
            className="w-full text-sm text-wisen-titulo/70 sm:w-auto [@media(max-height:600px)]:hidden"
          >
            {step === 0
              ? `${interests.length} ${interests.length === 1 ? "área selecionada" : "áreas selecionadas"} · mínimo de ${MINIMUM_INTERESTS}`
              : "Você pode alterar sua resposta no perfil."}
          </p>
          <div className="ml-auto flex w-full items-center justify-end gap-2 sm:w-auto">
            {step > 0 && (
              <Button
                type="button"
                variant="ghost"
                className="h-11 px-4 text-wisen-titulo"
                disabled={saving}
                onClick={() => {
                  setStep(0);
                  setError("");
                }}
              >
                Voltar
              </Button>
            )}
            {step > 0 && (
              <Button
                type="button"
                variant="ghost"
                className="h-11 px-4 text-wisen-titulo"
                disabled={saving}
                aria-label="Pular esta etapa"
                onClick={() => completeOnboarding(true)}
              >
                Pular
              </Button>
            )}
            <Button
              type="button"
              disabled={
                saving || (step === 0 ? new Set(interests).size < MINIMUM_INTERESTS : !familiarity)
              }
              onClick={() => {
                if (step === 0) {
                  setStep(1);
                  setError("");
                } else completeOnboarding();
              }}
              className="h-11 min-w-28 rounded-lg bg-[#F3E69A] px-5 font-semibold text-wisen-titulo hover:bg-[#EBDD80]"
            >
              {saving ? "Salvando..." : step === 0 ? "Continuar" : "Concluir"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
