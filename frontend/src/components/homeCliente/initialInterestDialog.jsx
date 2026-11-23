"use client";

import { ArrowRight, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InterestsCard } from "@/components/perfil/interestsCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requisitar } from "@/services/api";
import styles from "../authForm.module.css";
import { LocationPicker } from "./locationPicker";

const MINIMUM_INTERESTS = 3;

async function readResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export function InitialInterestDialog({ embedded = false, onComplete, onReady }) {
  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const transitionRef = useRef(false);
  const mountedRef = useRef(true);
  const [changingStep, setChangingStep] = useState(false);
  const [stepDirection, setStepDirection] = useState("forward");
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [interests, setInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(0);
  const [familiarity, setFamiliarity] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const Header = embedded ? "header" : DialogHeader;
  const Title = embedded ? "h1" : DialogTitle;
  const Body = embedded ? "div" : DialogBody;
  const Footer = embedded ? "footer" : DialogFooter;
  const locationValid = Boolean(
    location &&
      locations.some(
        (option) =>
          option.countryCode === location.countryCode && option.stateId === location.stateId,
      ),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt explicitly retries the profile request.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const [response, categoryData, locationData] = await Promise.all([
          fetch("/api/auth/profile", {
            credentials: "same-origin",
            cache: "no-store",
          }),
          requisitar("/categories"),
          requisitar("/locations/options"),
        ]);
        const data = await readResponse(response);
        if (!response.ok) {
          throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
        }
        const availableCategories = categoryData.categories?.map((category) => category.name);
        if (!Array.isArray(availableCategories)) {
          throw new Error("A resposta de categorias não contém uma lista válida.");
        }
        if (!Array.isArray(locationData.locations) || locationData.locations.length === 0) {
          throw new Error("Não foi possível carregar as localizações.");
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
          const savedLocation = locationData.locations.find(
            (option) =>
              option.countryCode === data.location?.countryCode &&
              option.stateId === data.location?.stateId,
          );
          const needsName = !data.user?.name?.trim() || !savedLocation;
          setName(data.user?.name ?? "");
          setLocations(locationData.locations);
          setLocation(savedLocation ? data.location : null);
          setStep(needsName ? -1 : 0);
          setProfile(data);
          setCategories(availableCategories);
          setInterests(selectedInterests);
          setFamiliarity(data.preferences.familiarity ?? "");
          setOpen(
            needsName || !onboardingCompleted || selectedInterests.length < MINIMUM_INTERESTS,
          );
          if (!needsName && onboardingCompleted && selectedInterests.length >= MINIMUM_INTERESTS) {
            onComplete?.();
          } else {
            onReady?.();
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message || "Não foi possível carregar seu perfil.");
          onReady?.();
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [attempt, onComplete, onReady]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stageRef.current?.getAnimations?.().forEach((animation) => {
        animation.cancel();
      });
    };
  }, []);

  async function changeStep(nextStep) {
    if (nextStep === step || transitionRef.current) return;
    const forward = nextStep > step;
    setStepDirection(forward ? "forward" : "backward");
    const stage = stageRef.current;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (stage?.animate && !reducedMotion) {
      transitionRef.current = true;
      setChangingStep(true);
      const currentStyle = window.getComputedStyle(stage);
      const animation = stage.animate(
        [
          { opacity: currentStyle.opacity, transform: currentStyle.transform },
          { opacity: 0, transform: `translateX(${forward ? -8 : 8}px)` },
        ],
        { duration: 160, easing: "ease-in-out", fill: "forwards" },
      );
      await animation.finished.catch(() => {});
      if (!mountedRef.current) return;
      animation.cancel();
    }
    setStep(nextStep);
    setChangingStep(false);
    transitionRef.current = false;
  }

  function toggleInterest(interest) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
    setError("");
  }

  async function saveName() {
    if (saving || !locationValid || name.trim().length < 2 || name.trim().length > 120) return;
    setSaving(true);
    setError("");
    try {
      const { user } = await requisitar("/auth/profile", {
        method: "PUT",
        body: {
          name: name.trim(),
          location,
        },
      });
      setProfile((current) => ({ ...current, user }));
      window.dispatchEvent(new CustomEvent("wisen:profile-updated", { detail: user }));
      changeStep(0);
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar seu nome.");
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding() {
    if (!profile || saving) return;
    if (new Set(interests).size < MINIMUM_INTERESTS) {
      setError("Escolha pelo menos 3 áreas de interesse para continuar.");
      changeStep(0);
      return;
    }

    if (!familiarity) {
      setError("Escolha sua familiaridade com economia para continuar.");
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
          familiarity,
          onboardingCompleted: true,
        }),
      });
      const data = await readResponse(response);
      if (!response.ok) {
        throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
      }

      setOpen(false);
      onComplete?.();
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar suas preferências.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return embedded ? (
      <div role="status" className={styles.onboardingLoading}>
        <div aria-hidden="true" className={styles.onboardingLoadingIcon}>
          <UserRound size={30} strokeWidth={1.5} />
        </div>
        <p>Preparando seu perfil…</p>
      </div>
    ) : null;
  }

  if (error && !profile) {
    return (
      <div
        role="alert"
        className={
          embedded
            ? "space-y-4 text-sm text-red-200"
            : "fixed top-4 right-4 left-4 z-50 mx-auto flex max-w-lg items-center justify-between gap-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-lg"
        }
      >
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={() => setAttempt((current) => current + 1)}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const currentStep = step + 2;
  const progress = open
    ? createPortal(
        <div className={styles.onboardingProgress} data-onboarding-progress aria-hidden="true">
          <div style={{ width: `${(currentStep / 3) * 100}%` }} />
        </div>,
        document.body,
      )
    : null;

  const content = (
    <>
      <div
        role="progressbar"
        aria-label="Progresso do onboarding"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={currentStep}
        aria-valuetext={`Etapa ${currentStep} de 3`}
        className="sr-only"
      />
      <div
        key={step}
        ref={stageRef}
        className={styles.onboardingStage}
        data-direction={stepDirection}
        data-onboarding-stage
      >
        {step !== -1 && (
          <Header className={styles.onboardingHeader} {...(!embedded && { eyebrow: null })}>
            <Title className={styles.onboardingTitle}>
              {step === 0
                ? "Quais assuntos interessam a você?"
                : "Como você se sente ao ler sobre economia?"}
            </Title>
          </Header>
        )}

        <Body
          className={`${styles.onboardingBody} ${step === -1 ? styles.onboardingDetailsBody : step === 1 ? styles.onboardingFamiliarityBody : ""}`}
        >
          {step === -1 ? (
            <form
              id="onboarding-name-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveName();
              }}
              className={styles.onboardingNameForm}
            >
              <Title className={styles.onboardingTitle}>Nome Completo</Title>
              <Label htmlFor="onboarding-name" className="sr-only">
                Nome Completo
              </Label>
              <Input
                id="onboarding-name"
                name="name"
                autoComplete="name"
                placeholder="Digite seu nome completo"
                required
                minLength={2}
                maxLength={120}
                value={name}
                disabled={saving || changingStep}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
              />
              <LocationPicker
                locations={locations}
                value={location}
                disabled={saving || changingStep}
                onChange={(nextLocation) => {
                  setLocation(nextLocation);
                  setError("");
                }}
              />
              <p className={styles.onboardingAttribution}>
                Dados de{" "}
                <a
                  href="https://github.com/dr5hn/countries-states-cities-database"
                  target="_blank"
                  rel="noreferrer"
                >
                  Countries States Cities Database
                </a>{" "}
                · ODbL 1.0
              </p>
            </form>
          ) : step === 0 ? (
            <div className={styles.onboardingInterests}>
              <div className={styles.onboardingSelection}>
                <p>Selecione {MINIMUM_INTERESTS} ou mais</p>
                <p
                  aria-live="polite"
                  data-ready={interests.length >= MINIMUM_INTERESTS || undefined}
                >
                  {interests.length} {interests.length === 1 ? "selecionado" : "selecionados"}
                </p>
              </div>
              <InterestsCard
                categories={categories}
                interests={interests}
                onToggle={toggleInterest}
                minimumSelections={MINIMUM_INTERESTS}
                showSaveControls={false}
                systemColors
                embedded
                selectionTiles
                showSearch={false}
                saving={saving || changingStep}
              />
            </div>
          ) : (
            <div className={styles.onboardingFamiliarity}>
              <fieldset disabled={saving || changingStep}>
                <legend className="sr-only">Sua familiaridade com economia</legend>
                {[
                  ["beginner", "Estou começando", "Quero entender os primeiros conceitos."],
                  ["basic", "Entendo o básico", "Quero conectar conceitos e notícias."],
                  ["experienced", "Já acompanho economia", "Quero aprofundar minhas análises."],
                ].map(([value, label, description]) => (
                  <label key={value} className={styles.onboardingOption}>
                    <input
                      type="radio"
                      name="onboarding-familiarity"
                      aria-label={label}
                      value={value}
                      checked={familiarity === value}
                      onChange={() => {
                        setFamiliarity(value);
                        setError("");
                      }}
                    />
                    <span>
                      <span>{label}</span>
                      <span>{description}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
          )}
        </Body>
      </div>

      {error && (
        <p
          role="alert"
          className="shrink-0 border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-8"
        >
          {error}
        </p>
      )}

      <Footer className={styles.onboardingFooter}>
        <div
          className={`grid w-full items-center gap-3 ${step > -1 ? "grid-cols-[minmax(0,3fr)_minmax(0,7fr)]" : "grid-cols-1"}`}
        >
          {step > -1 && (
            <Button
              type="button"
              variant="ghost"
              className={styles.onboardingBack}
              disabled={saving || changingStep}
              onClick={() => {
                changeStep(step - 1);
                setError("");
              }}
            >
              Voltar
            </Button>
          )}
          <Button
            type="button"
            disabled={
              saving ||
              changingStep ||
              (step === -1
                ? !locationValid || name.trim().length < 2 || name.trim().length > 120
                : step === 0
                  ? new Set(interests).size < MINIMUM_INTERESTS
                  : !familiarity)
            }
            onClick={() => {
              if (step === -1) {
                saveName();
              } else if (step === 0) {
                changeStep(1);
                setError("");
              } else completeOnboarding();
            }}
            className={styles.onboardingPrimaryAction}
          >
            {saving ? "Salvando..." : step <= 0 ? "Continuar" : "Concluir"}
            {!saving && step <= 0 && <ArrowRight aria-hidden="true" className="ml-1 size-4" />}
          </Button>
        </div>
      </Footer>
    </>
  );

  if (embedded)
    return open ? (
      <>
        {progress}
        <section className={styles.onboarding} aria-label="Personalize sua experiência">
          {content}
        </section>
      </>
    ) : null;

  return (
    <>
      {progress}
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
          size="xl"
          className={`${styles.onboarding} ${styles.onboardingDialog}`}
        >
          {content}
        </DialogContent>
      </Dialog>
    </>
  );
}
