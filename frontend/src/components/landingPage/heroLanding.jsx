"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeroBackground from "./heroBackground";
import { LandingNavbar } from "./landingNavbar";

export function HeroLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverLightSection, setIsOverLightSection] = useState(false);
  const headerRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0;
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      setIsOverLightSection(heroBottom <= headerHeight);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative min-h-[112svh] w-full overflow-x-clip bg-[#080E21]"
    >
      <HeroBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[#080E21]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[clamp(6rem,18svh,9rem)] bg-[linear-gradient(to_bottom,#EEF5FB00,#EEF5FB18_20%,#EEF5FB58_40%,#EEF5FBA7_60%,#EEF5FBE7_80%,#EEF5FB)] sm:h-[clamp(9rem,20svh,14rem)]"
      />

      <LandingNavbar
        headerRef={headerRef}
        isScrolled={isScrolled}
        isOverLightSection={isOverLightSection}
      />

      <div className="relative z-10 flex min-h-svh items-center px-4 py-36 sm:px-6 sm:py-40 lg:min-h-[max(760px,100svh)] lg:px-8 xl:px-12">
        <div className="mx-auto flex w-full max-w-[920px] flex-col items-center gap-6 text-center">
          <div className="min-w-0">
            <h1 className="text-[clamp(2.75rem,8.5vw,3.375rem)] font-medium leading-[1.1] tracking-[-0.05em] text-white sm:text-[clamp(2.5rem,6vw,4.75rem)]">
              <span className="block">Entenda o mundo.</span>
              <span className="block">
                Construa o <span className="text-[#E8E191]">seu.</span>
              </span>
            </h1>
          </div>

          <div className="flex w-full max-w-[480px] flex-col items-center gap-7">
            <p className="text-base leading-[1.75] text-[#BBC5D8] sm:text-lg">
              Notícias explicadas. Ideias conectadas.
              <br />
              Conhecimento que fica.
            </p>

            <div className="flex w-full flex-col items-center gap-5">
              <a
                href="#sobre"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#E8E191] px-6 py-3 text-sm font-semibold text-[#101A40] shadow-[0_8px_24px_rgba(232,225,145,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-wisen-hover hover:shadow-[0_10px_28px_rgba(232,225,145,0.28)] active:translate-y-0 active:bg-[#D8CB72] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
              >
                <Play aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
                <span>Veja como funciona</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
