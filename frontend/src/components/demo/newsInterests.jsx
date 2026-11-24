"use client";

import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { useResource } from "@/components/platform/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  dialogPrimaryAction,
} from "@/components/ui/dialog";
import { requisitar } from "@/services/api";

const minimumInterests = 3;
const maximumInterests = 50;

export function NewsInterests({ onSaved }) {
  const profile = useResource("/auth/profile");
  const categoryResource = useResource("/categories");
  const [savedInterests, setSavedInterests] = useState(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const inFlight = useRef(false);

  const interests = savedInterests ?? profile.data?.preferences?.interests ?? [];
  const categories = categoryResource.data?.categories?.map((category) => category.name) ?? [];
  const availableDraft = (draft ?? interests).filter((interest) => categories.includes(interest));
  const hasChanges =
    availableDraft.length !== interests.length ||
    availableDraft.some((interest) => !interests.includes(interest));
  const loadError = profile.error || categoryResource.error;
  const loading = profile.loading || categoryResource.loading;
  const canSave =
    !loading &&
    !loadError &&
    hasChanges &&
    availableDraft.length >= minimumInterests &&
    availableDraft.length <= maximumInterests;

  function handleOpenChange(nextOpen, eventDetails) {
    if (inFlight.current) {
      eventDetails.cancel();
      return;
    }
    if (nextOpen) {
      setDraft(null);
      setSaveError("");
    }
    setOpen(nextOpen);
  }

  function toggleInterest(interest) {
    setDraft((previous) => {
      const current = previous ?? interests;
      return current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest];
    });
    setSaveError("");
  }

  async function saveInterests() {
    if (!canSave || inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setSaveError("");
    try {
      await requisitar("/auth/profile", { method: "PUT", body: { interests: availableDraft } });
      setSavedInterests(availableDraft);
      setOpen(false);
      onSaved();
    } catch (error) {
      setSaveError(error.message || "Não foi possível salvar seus interesses.");
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  function retryLoading() {
    if (profile.error) profile.reload();
    if (categoryResource.error) categoryResource.reload();
  }

  return (
    <section
      aria-labelledby="news-interests-title"
      className="wisen-panel relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"
    >
      <div className="min-w-0">
        <h2
          id="news-interests-title"
          className="pr-10 text-sm font-semibold text-wisen-titulo sm:pr-0"
        >
          Seus temas
        </h2>
        <span aria-hidden="true" className="mt-2 block h-0.5 w-8 rounded-full bg-[#D7BF4D]" />
        <div className="mt-2 space-y-1 text-sm leading-5 text-wisen-texto-suave">
          <p>Acompanhe as notícias do dia e descubra os conceitos por trás de cada assunto.</p>
          <p>
            {profile.loading
              ? "Carregando seus interesses..."
              : profile.error
                ? "Não foi possível carregar seus interesses."
                : interests.length
                  ? "Seu feed é personalizado com os temas que você escolheu."
                  : "Escolha seus temas para personalizar o feed."}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:ml-auto sm:justify-end" aria-live="polite">
        {interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-transparent bg-[#FBF7E5] px-3 py-1.5 text-[11px] font-medium text-wisen-titulo"
          >
            {interest}
          </span>
        ))}
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          aria-label="Editar áreas de interesse"
          title="Editar áreas de interesse"
          disabled={profile.loading}
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              className="absolute top-3 right-4 cursor-pointer hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent sm:static"
            />
          }
        >
          <Pencil aria-hidden="true" className="text-wisen-destaque" />
        </DialogTrigger>
        <DialogContent showCloseButton={!saving}>
          <DialogHeader eyebrow={false}>
            <DialogTitle>Editar áreas de interesse</DialogTitle>
            <DialogDescription>
              Escolha pelo menos {minimumInterests} temas para personalizar suas notícias.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {loading ? (
              <p role="status">Carregando temas...</p>
            ) : loadError ? (
              <div className="space-y-3">
                <p role="alert">Não foi possível carregar seus temas.</p>
                <Button type="button" variant="outline" onClick={retryLoading}>
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <InterestsCard
                categories={categories}
                interests={availableDraft}
                onToggle={toggleInterest}
                saving={saving}
                showSaveControls={false}
                systemColors
                embedded
              />
            )}
            {(saveError || availableDraft.length > maximumInterests) && (
              <p role="alert" className="mt-3 text-red-700">
                {saveError || `Selecione até ${maximumInterests} temas.`}
              </p>
            )}
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              className={dialogPrimaryAction}
              onClick={saveInterests}
              disabled={saving || !canSave}
            >
              {saving ? "Salvando..." : "Salvar interesses"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
