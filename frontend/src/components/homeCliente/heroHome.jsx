"use client";

import { useEffect, useState } from "react";
import { HomeBanner } from "@/components/app/homeBanner";
import Link from "@/components/demo/link";
import { requisitar } from "@/services/api";

export default function HeroHome() {
  const [name, setName] = useState("");

  useEffect(() => {
    async function loadName() {
      try {
        const data = await requisitar("/auth/session");
        setName(data.user?.name?.trim() ?? "");
      } catch {
        setName("");
      }
    }
    const onProfileUpdated = (event) => setName(event.detail.name.trim());
    window.addEventListener("wisen:profile-updated", onProfileUpdated);
    loadName();
    return () => window.removeEventListener("wisen:profile-updated", onProfileUpdated);
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
        className="group inline-flex items-center justify-center mt-5 h-10 rounded-lg bg-[#F3E69A] px-6 font-semibold text-wisen-texto shadow-none transition-all hover:-translate-y-0.5 hover:bg-wisen-hover hover:shadow-md active:translate-y-0"
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
