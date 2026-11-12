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
        const response = await fetch("/api/auth/profile", {
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = await readResponse(response);
        if (!response.ok) {
          throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
        }
        const savedInterests = data.preferences?.interests;
        if (!Array.isArray(savedInterests)) {
          throw new Error("A resposta do perfil não contém uma lista de interesses válida.");
        }
        const onboardingCompleted =
          typeof data.preferences.onboardingCompleted === "boolean"
            ? data.preferences.onboardingCompleted
            : savedInterests.length > 0;
        if (active) {
          setProfile(data);
          setInterests(savedInterests);
          setOpen(!onboardingCompleted);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#2B333F]">
            Quais assuntos interessam a você?
          </DialogTitle>
          <DialogDescription>
            Escolha suas áreas de interesse para personalizar os conteúdos do Wisen. Você pode
            alterar suas escolhas depois no perfil.
          </DialogDescription>
        </DialogHeader>

        <InterestsCard interests={interests} onToggle={toggleInterest} />

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => completeOnboarding(profile.preferences.interests)}
          >
            Agora não
          </Button>
          <Button
            type="button"
            disabled={saving || interests.length === 0}
            onClick={() => completeOnboarding(interests)}
            className="bg-[#2B333F] text-white hover:bg-[#1f252e]"
          >
            {saving ? "Salvando..." : "Salvar interesses"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
