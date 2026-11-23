"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeroVideo from "./heroVideo";
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
    <section ref={heroRef} id="inicio" className="relative w-full overflow-x-clip bg-[#080E21]">
      <HeroVideo />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-12 bg-[linear-gradient(180deg,rgba(238,245,251,0)_0%,rgba(238,245,251,0.03)_30%,rgba(238,245,251,0.2)_55%,rgba(238,245,251,0.65)_80%,#EEF5FB_100%)] sm:h-16"
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
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#E8E191] px-6 py-3 text-sm font-semibold text-[#101A40] transition-colors duration-200 hover:bg-[#F3EB9B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
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
