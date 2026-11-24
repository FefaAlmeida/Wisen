"use client";

import { Dialog } from "@base-ui/react/dialog";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function TourSpotlight({ target }) {
  const [geometry, setGeometry] = useState(null);

  useLayoutEffect(() => {
    function measure() {
      const desktop = document.querySelector(`[data-zuzu-tour-target="${target}"]`);
      const mobile = document.querySelector('[data-zuzu-tour-target="mobile-menu"]');
      const onDesktop = Boolean(desktop?.getClientRects().length);
      const visible = onDesktop ? desktop : mobile;
      setGeometry(
        visible && {
          bounds: visible.getBoundingClientRect(),
          onDesktop,
          cardCenter: window.innerHeight / 2,
        },
      );
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [target]);

  if (!geometry) return null;
  const { bounds, onDesktop, cardCenter } = geometry;
  const targetCenter = bounds.top + bounds.height / 2;
  const elbow = bounds.right + 10;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <div
        className="absolute rounded-xl border-2 border-[#EBDD80] shadow-[0_0_0_150vmax_rgba(16,26,64,0.66)]"
        style={{
          top: bounds.top - 3,
          left: bounds.left - 3,
          width: bounds.width + 6,
          height: bounds.height + 6,
        }}
      />
      {onDesktop ? (
        <>
          <div
            className="absolute h-0.5 w-2 bg-[#EBDD80]"
            style={{ top: targetCenter, left: bounds.right + 3 }}
          />
          <div
            className="absolute w-0.5 bg-[#EBDD80]"
            style={{
              top: Math.min(targetCenter, cardCenter),
              left: elbow,
              height: Math.abs(targetCenter - cardCenter) + 2,
            }}
          />
          <div
            className="absolute h-0.5 w-10 bg-[#EBDD80]"
            style={{ top: cardCenter, left: elbow }}
          />
        </>
      ) : (
        <div
          className="absolute w-0.5 bg-[#EBDD80]"
          style={{
            top: bounds.bottom + 3,
            left: bounds.left + bounds.width / 2,
            height: Math.max(0, cardCenter - bounds.bottom),
          }}
        />
      )}
    </div>
  );
}

export function ZuzuTour({ steps, storageKey, portrait }) {
  const [stepIndex, setStepIndex] = useState(null);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const owlOnRight = stepIndex % 2 === 1;

  useEffect(() => {
    if (!storageKey) return;
    try {
      if (window.localStorage.getItem(storageKey)) return;
    } catch {
      // The guide is still available when the browser blocks storage.
    }
    setStepIndex(0);
  }, [storageKey]);

  function finishTour() {
    setStepIndex(null);
    try {
      if (storageKey) window.localStorage.setItem(storageKey, "seen");
    } catch {
      // Closing the guide does not depend on storage access.
    }
  }

  if (!storageKey) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Rever tour"
        title="Rever tour com a Zuzu"
        onClick={() => setStepIndex(0)}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-wisen-borda bg-wisen-superficie shadow-sm transition-colors hover:bg-wisen-destaque-suave focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wisen-titulo"
      >
        <Image src={portrait} alt="" width={30} height={30} unoptimized />
      </button>
      <Dialog.Root
        open={Boolean(step)}
        onOpenChange={(open) => {
          if (!open) finishTour();
        }}
        disablePointerDismissal
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-[60]" />
          {step && <TourSpotlight target={step.href} />}
          <Dialog.Popup className="fixed top-1/2 left-4 z-[61] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[26rem] -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-wisen-borda bg-white p-5 text-wisen-titulo shadow-xl outline-none sm:left-[92px] sm:p-6 lg:left-[256px]">
            {step && (
              <>
                <div className={`flex items-start gap-3 ${owlOnRight ? "flex-row-reverse" : ""}`}>
                  <Image
                    key={step.href}
                    src={step.portrait ?? portrait}
                    alt=""
                    width={192}
                    height={192}
                    unoptimized
                    loading="eager"
                    className={`h-auto w-16 shrink-0 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200 sm:w-24 ${step.owlPosition ?? "self-center"} ${owlOnRight ? "motion-safe:slide-in-from-right-2" : "motion-safe:slide-in-from-left-2"}`}
                  />
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    className={`relative min-w-0 flex-1 rounded-xl border border-wisen-borda bg-wisen-superficie p-3 before:absolute before:top-6 before:size-2.5 before:rotate-45 before:border-wisen-borda before:bg-wisen-superficie ${owlOnRight ? "before:-right-1.5 before:border-t before:border-r" : "before:-left-1.5 before:border-b before:border-l"}`}
                  >
                    <p className="mb-1 text-xs font-medium text-wisen-texto-suave">
                      Etapa {stepIndex + 1} de {steps.length}
                    </p>
                    <Dialog.Title className="text-xl font-semibold">{step.title}</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm leading-relaxed">
                      {step.description}
                    </Dialog.Description>
                  </div>
                </div>
                <p className="mt-3 text-sm text-wisen-texto-suave sm:hidden">
                  Você encontra essas seções no menu no topo da tela.
                </p>
                <div aria-hidden="true" className="mt-5 flex gap-1.5">
                  {steps.map(({ href }, index) => (
                    <span
                      key={href}
                      className={`h-1 flex-1 rounded-full ${index <= stepIndex ? "bg-[#D6B92F]" : "bg-wisen-borda"}`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <Button type="button" variant="ghost" onClick={finishTour}>
                    Pular tour
                  </Button>
                  <div className="flex gap-2">
                    {stepIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStepIndex(stepIndex - 1)}
                      >
                        Voltar
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={isLast ? finishTour : () => setStepIndex(stepIndex + 1)}
                    >
                      {isLast ? "Concluir" : "Próximo"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
