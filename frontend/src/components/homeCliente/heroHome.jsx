"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HomeBanner } from "@/components/app/homeBanner";

export default function HeroHome() {
  const [name, setName] = useState("");

  useEffect(() => {
    async function loadName() {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) return;
        const data = await response.json();
        setName(data.user?.name?.trim() ?? "");
      } catch {
        setName("");
      }
    }
    loadName();
  }, []);

  return (
    <HomeBanner
      eyebrow={name ? `Olá, ${name}` : "Seu espaço de aprendizado"}
      title="Suas notícias."
      highlight="Seu aprendizado."
      description="Acompanhe os acontecimentos do mundo e evolua seu conhecimento de forma personalizada."
    >
      <Link
        href="/paginaExplorar"
        className="group inline-flex items-center justify-center mt-5 h-10 rounded-lg bg-[#F3E69A] px-6 font-semibold text-wisen-texto shadow-none transition-all hover:-translate-y-0.5 hover:bg-[#EBDD80] hover:shadow-md active:translate-y-0"
      >
        Explorar notícias
        <span
          className="ml-3 text-lg transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </HomeBanner>
  );
}
