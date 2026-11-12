"use client";

import { useEffect, useState } from "react";
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

const MINIMUM_INTERESTS = 2;

async function readResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export function InitialInterestDialog() {
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [categories, setCategories] = useState([]);
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

  async function completeOnboarding(selectedInterests) {
    if (!profile || saving) return;
    if (
      new Set(selectedInterests).size < MINIMUM_INTERESTS ||
      selectedInterests.some((interest) => !categories.includes(interest))
    ) {
      setError("Escolha pelo menos 2 áreas de interesse para continuar.");
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
          interests: selectedInterests,
        }),
      });
      const data = await readResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
      }

      setProfile((current) => ({
        ...current,
        preferences: {
          ...current.preferences,
          interests: selectedInterests,
          onboardingCompleted: true,
        },
      }));
      setOpen(false);
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar suas áreas de interesse.");
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-wisen-borda bg-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-wisen-titulo">
            Quais assuntos interessam a você?
          </DialogTitle>
          <DialogDescription className="text-wisen-texto-suave">
            Escolha pelo menos 2 áreas de interesse para personalizar os conteúdos do Wisen. Você
            pode alterar suas escolhas depois no perfil.
          </DialogDescription>
        </DialogHeader>

        <InterestsCard
          categories={categories}
          interests={interests}
          onToggle={toggleInterest}
          minimumSelections={MINIMUM_INTERESTS}
          showSaveControls={false}
          systemColors
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button
            type="button"
            disabled={
              saving ||
              new Set(interests).size < MINIMUM_INTERESTS ||
              interests.some((interest) => !categories.includes(interest))
            }
            onClick={() => completeOnboarding(interests)}
            className="bg-[#F3E69A] text-wisen-titulo hover:bg-[#EBDD80]"
          >
            {saving ? "Salvando..." : "Salvar interesses"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
