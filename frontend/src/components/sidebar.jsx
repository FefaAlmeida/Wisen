"use client";

import {
  Compass,
  Clock3,
  GraduationCap,
  Home,
  Link2,
  Newspaper,
  Settings,
} from "lucide-react";
import Link from "next/link";

const navigation = [
  { label: "Início", href: "/paginaInicialCliente", icon: Home },
  { label: "Explorar", icon: Compass },
  { label: "Revisões", href: "/paginaInicialCliente#revisoes", icon: Clock3 },
  {
    label: "Meu conhecimento",
    href: "/paginaBiblioteca",
    icon: GraduationCap,
  },
  { label: "Notícias", href: "/paginaEvento", icon: Newspaper },
  { label: "Conexões", icon: Link2 },
  { label: "Aprendizado", icon: GraduationCap },
];

export default function Sidebar({ activeItem }) {
  return (
    <aside
      className="fixed inset-y-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-5 text-white sm:flex lg:w-[220px] lg:px-4"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <Link
        href="/paginaInicialCliente"
        className="mb-8 px-1 text-[20px] font-bold tracking-tight lg:text-[24px]"
      >
        Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
      </Link>

      <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
        {navigation.map(({ label, href, icon: Icon }) => {
          const isActive =
            label === activeItem ||
            (activeItem === "Conceitos" && label === "Meu conhecimento");

          return href ? (
            <Link
              key={label}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-10 items-center gap-2 rounded-md px-2 text-[10px] transition-colors lg:gap-3 lg:px-2.5 lg:text-[12px] ${
                isActive
                  ? "bg-[#fff2bc] font-semibold text-[#25303c]"
                  : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          ) : (
            <span
              key={label}
              aria-disabled="true"
              className="flex h-10 cursor-not-allowed items-center gap-2 rounded-md px-2 text-[10px] text-[#c5ced8]/60 lg:gap-3 lg:px-2.5 lg:text-[12px]"
              title="Página ainda não disponível"
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </span>
          );
        })}
      </nav>

      <Link
        href="/paginaPerfil"
        aria-current={activeItem === "Configurações" ? "page" : undefined}
        className={`mt-auto flex h-10 items-center gap-2 rounded-md px-2 text-[10px] transition-colors lg:gap-3 lg:px-2.5 lg:text-[12px] ${
          activeItem === "Configurações"
            ? "bg-[#fff2bc] font-semibold text-[#25303c]"
            : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
        }`}
      >
        <Settings size={17} strokeWidth={1.8} />
        <span>Configurações</span>
      </Link>
    </aside>
  );
}
