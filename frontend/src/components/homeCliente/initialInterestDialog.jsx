"use client";

import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
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
      <DialogContent ref={dialogRef} initialFocus={dialogRef} showCloseButton={false} size="xl">
        <DialogHeader eyebrow={null}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 [@media(max-height:600px)]:mb-2">
            <span className="text-[10px] font-semibold tracking-[0.12em] text-[#93A3BE] uppercase">
              Wisen do seu jeito
            </span>
            <p
              role="status"
              className="rounded-full border border-[#E8DDA4] bg-[#FBF7E5] px-2.5 py-1 text-[11px] font-medium text-[#866D16]"
            >
              Etapa {step + 1} de 2
            </p>
          </div>
          <DialogTitle className="max-w-xl">
            {step === 0 ? (
              <>
                Quais assuntos <span className="text-[#B59B35]">interessam a você?</span>
              </>
            ) : (
              <>
                Como você se sente <span className="text-[#B59B35]">ao ler sobre economia?</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="max-w-xl">
            {step === 0
              ? "Escolha pelo menos 3 assuntos para encontrar conteúdos que combinam com você. Depois, você pode ajustar suas escolhas no perfil."
              : "Vamos adaptar as explicações ao seu momento. Não é um teste e você pode pular esta pergunta."}
          </DialogDescription>
          <ol
            aria-label="Etapas da personalização"
            className="mt-5 flex min-w-0 items-center gap-3 text-xs [@media(max-height:600px)]:mt-3"
          >
            {["Seus interesses", "Seu momento"].map((label, index) => (
              <li
                key={label}
                aria-current={step === index ? "step" : undefined}
                className={`flex min-w-0 flex-1 items-center gap-2 border-t-2 pt-3 ${step >= index ? "border-[#D7BF4D] text-[#526584]" : "border-[#E8EDF4] text-[#93A3BE]"}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${step >= index ? "bg-[#F3E69A] text-[#526584]" : "bg-[#F1F3F6] text-[#93A3BE]"}`}
                >
                  {step > index ? <Check className="size-3" /> : index + 1}
                </span>
                <span className="min-w-0">{label}</span>
              </li>
            ))}
          </ol>
        </DialogHeader>

        <DialogBody>
          {step === 0 ? (
            <InterestsCard
              categories={categories}
              interests={interests}
              onToggle={toggleInterest}
              minimumSelections={MINIMUM_INTERESTS}
              showSaveControls={false}
              systemColors
              embedded
              onboarding
              saving={saving}
            />
          ) : (
            <fieldset disabled={saving} className="space-y-3">
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
                  className="flex min-h-20 min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-wisen-borda bg-white px-4 py-4 text-wisen-titulo transition-colors hover:border-[#DCCA70] hover:bg-[#FBF7E5] has-[:checked]:border-[#DCCA70] has-[:checked]:bg-[#FBF5D9] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wisen-titulo"
                >
                  <input
                    type="radio"
                    name="onboarding-familiarity"
                    className="mt-0.5 size-4 shrink-0 accent-wisen-titulo"
                    aria-label={label}
                    value={value}
                    checked={familiarity === value}
                    onChange={() => {
                      setFamiliarity(value);
                      setError("");
                    }}
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs leading-5 text-[#7182A1]">{description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}
        </DialogBody>

        {error && (
          <p
            role="alert"
            className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-8"
          >
            {error}
          </p>
        )}

        <DialogFooter className="flex-row items-center sm:justify-between">
          <p
            aria-live="polite"
            className="w-full text-xs leading-5 text-[#7182A1] sm:w-auto [@media(max-height:600px)]:hidden"
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
                className="h-11 px-3 text-sm text-[#7182A1] hover:bg-[#F1F3F6]"
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
                className="h-11 px-3 text-sm text-[#7182A1] hover:bg-[#F1F3F6]"
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
              className="h-11 min-w-28 rounded-xl bg-[#101A40] px-5 text-sm font-medium text-white hover:bg-[#30466E] disabled:bg-[#E8ECF3] disabled:text-[#93A3BE] disabled:opacity-100"
            >
              {saving ? "Salvando..." : step === 0 ? "Continuar" : "Concluir"}
              {!saving && step === 0 && <ArrowRight aria-hidden="true" className="ml-1 size-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
