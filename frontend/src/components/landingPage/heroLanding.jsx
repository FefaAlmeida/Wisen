"use client";

import { ArrowRight, Menu, Play, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HeroVideo from "./heroVideo";

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
      className="relative w-full overflow-x-clip bg-[#101A40]"
    >
      <HeroVideo />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,225,145,0.16),transparent_22%),radial-gradient(circle_at_center,_rgba(16,26,64,0.12),transparent_45%),linear-gradient(180deg,rgba(7,13,31,0.38)_0%,rgba(7,13,31,0.24)_25%,rgba(7,13,31,0.48)_55%,rgba(7,13,31,0.74)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(7,13,31,0.65)_0%,rgba(7,13,31,0.35)_48%,rgba(7,13,31,0.12)_100%)]" />

      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-20 px-4 ${
          isScrolled ? "pt-2" : "pt-4"
        } transition-all duration-300 sm:px-6 md:absolute md:pt-4 lg:px-8 xl:px-12`}
      >
        <div
          className={`mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/20 ${
            isOverLightSection ? "bg-[#101A40]/95" : "bg-white/5"
          } px-4 ${
            isScrolled ? "py-2" : "py-3"
          } shadow-[0_12px_26px_-18px_rgba(7,13,31,0.75)] backdrop-blur-md transition-all duration-300 md:flex-nowrap md:rounded-full md:bg-white/5 sm:px-5 lg:px-6`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
          >
            <span className="text-[1.7rem] font-black leading-none tracking-[-0.08em] text-white sm:text-[1.9rem]">
              Wisen
            </span>
            <span className="text-[1.4rem] font-black leading-none tracking-[-0.08em] text-[#E8E191] sm:text-[1.6rem]">
              •
            </span>
          </Link>

          <nav
            aria-label="Navegação da plataforma"
            className="hidden items-center justify-between gap-2 md:flex"
          >
            <Link
              href="/paginaLogin"
              className="rounded-full bg-[#E8E191] px-4 py-2 text-sm font-semibold text-[#101A40] shadow-[0_12px_20px_-12px_rgba(232,225,145,0.9)] transition-all duration-200 hover:bg-[#F3EB9B]"
            >
              Entrar
            </Link>
            <Link
              href="/paginaCadastro"
              className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-white"
            >
              Criar conta
            </Link>
          </nav>

          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Abrir menu"
                  className={`flex ${
                    isScrolled ? "h-9 w-9" : "h-10 w-10"
                  } items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:bg-white/10 md:hidden`}
                >
                  <Menu className="h-5 w-5" />
                </button>
              }
            />
            <SheetContent
              side="right"
              showCloseButton={false}
              style={{ width: "35vw" }}
              className="gap-6 border-l border-white/20 bg-[#101A40] p-3 text-white sm:p-4"
            >
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">Menu</span>
                <SheetClose className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar menu</span>
                </SheetClose>
              </div>
              <nav aria-label="Navegação da plataforma" className="flex flex-col gap-3">
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/paginaLogin"
                      className="rounded-lg bg-[#E8E191] px-3 py-2 text-center text-sm font-semibold text-[#101A40] transition-colors hover:bg-[#F3EB9B]"
                    >
                      Entrar
                    </Link>
                  }
                />
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/paginaCadastro"
                      className="rounded-lg px-3 py-2 text-center text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Criar conta
                    </Link>
                  }
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="relative z-10 flex min-h-svh items-center px-4 pb-16 pt-48 sm:px-6 sm:pb-20 sm:pt-44 lg:min-h-[max(640px,100svh)] lg:px-8 lg:pb-24 lg:pt-40 xl:px-12">
        <div className="mx-auto grid w-full max-w-[1320px] items-end gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 space-y-6 lg:col-span-8 lg:space-y-8">
            <span className="inline-flex max-w-full items-center rounded-full border border-[#E8E191]/50 bg-[#101A40]/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#F4F6FA] backdrop-blur-sm sm:text-[11px]">
              A inteligência para um Brasil e o mundo
            </span>

            <h1 className="text-[clamp(2.5rem,8.5vw,6.5rem)] font-bold leading-[1.02] tracking-[-0.06em] text-white lg:text-[clamp(3.75rem,5.6vw,6.5rem)]">
              <span className="block">Entenda o mundo.</span>
              <span className="block">
                Construa o{" "}
                <span className="relative text-[#D9C54E]">
                  <span className="relative z-10">seu</span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-[0.06em] left-0 right-0 h-[0.14em] bg-[#E8E191]"
                  />
                  <span className="relative text-transparent">
                    .
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[0.12em] right-0 h-3 w-3 rounded-full bg-[#D9C54E] sm:h-4 sm:w-4"
                    />
                  </span>
                </span>
              </span>
            </h1>
          </div>

          <div className="flex w-full max-w-[480px] flex-col items-start gap-8 lg:col-span-4 lg:pb-1">
            <p className="max-w-[384px] text-lg leading-[1.6] text-[#E9EEF7] xl:text-xl">
              O Wisen transforma complexidade em aprendizado, com explicações claras, conexões
              personalizadas e o seu mundo completo ao seu alcance.
            </p>

            <div className="flex flex-wrap items-center gap-5 sm:gap-3">
              <Link
                href="/paginaCadastro"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-[#D1CB83] px-5 text-sm font-semibold text-[#101A40] shadow-[0_12px_26px_-12px_rgba(209,203,131,0.9)] transition-colors duration-200 hover:bg-[#DBD48C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D1CB83]"
              >
                <span>Começar agora</span>
                <ArrowRight className="h-4 w-4 text-[#101A40] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#sobre"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D1CB83]">
                  <Play className="ml-0.5 h-3 w-3 fill-[#101A40] text-[#101A40] transition-transform duration-200 group-hover:scale-125" />
                </div>
                <span>Ver como funciona</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
