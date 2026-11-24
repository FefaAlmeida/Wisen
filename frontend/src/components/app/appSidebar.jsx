"use client";

import {
  Bookmark,
  BookOpen,
  Bot,
  CalendarDays,
  Clock3,
  Gauge,
  Globe,
  GraduationCap,
  Home,
  Menu,
  Newspaper,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Início", href: "/paginaInicialCliente", icon: Home },
  { label: "Notícias", href: "/paginaExplorar", icon: Newspaper },
  { label: "Conceitos", href: "/paginaBiblioteca", icon: BookOpen },
  { label: "Revisões", href: "/paginaRevisoes", icon: Clock3 },
  { label: "Aprendizado", href: "/paginaConhecimento", icon: GraduationCap },
  { label: "Salvos", href: "/paginaGuardados", icon: Bookmark },
];

const adminNavigation = [
  { label: "Visão geral", href: "/paginaInicioAdm", icon: Gauge },
  { label: "Revisão de eventos", href: "/paginaCuradoriaEventosAdm", icon: CalendarDays },
  { label: "Gestão de usuários", href: "/paginaGestaoUsuariosAdm", icon: UsersRound },
  { label: "Gestão de fontes", href: "/paginaGestaoFonteAdm", icon: Globe },
  { label: "Gestão de categorias", href: "/paginaGestaoCategoriasAdm", icon: Tags },
  { label: "Monitor de IA", href: "/paginaMonitorIa", icon: Bot },
];

function WisenBrand({ className = "", large = false, admin = false }) {
  return (
    <Link
      href={admin ? "/paginaInicioAdm" : "/paginaInicialCliente"}
      className={`inline-flex items-center gap-2.5 text-white ${className}`}
    >
      <Image
        src="/logoWisen-simbolo-transparente.png"
        alt="Logo Wisen"
        width={44}
        height={44}
        className="size-10 shrink-0 object-contain lg:size-11"
      />
      <span
        className={`text-xl font-bold leading-none tracking-[-0.06em] sm:hidden lg:block ${large ? "lg:text-[1.75rem]" : ""}`}
      >
        Wisen
      </span>
    </Link>
  );
}

function NavigationItems({ activeItem, mobile = false, admin = false }) {
  const items = admin ? adminNavigation : navigation;
  return (
    <nav
      aria-label={admin ? "Navegação administrativa" : "Navegação principal"}
      className="flex flex-col gap-2.5"
    >
      {items.map(({ label, href, icon: Icon }) => {
        const isActive =
          label === activeItem ||
          (activeItem === "Guardados" && label === "Salvos") ||
          (activeItem === "Meu conhecimento" && label === "Conceitos");
        const className = mobile
          ? `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
              isActive
                ? "bg-wisen-destaque-suave font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-white/10"
            }`
          : `flex min-h-11 items-center justify-center gap-2.5 rounded-xl px-2.5 text-[11px] lg:justify-start transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] lg:gap-3 lg:px-2.5 lg:text-[13px] ${
              isActive
                ? "bg-wisen-destaque-suave font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-white/10"
            }`;

        if (!href) {
          return (
            <span
              key={label}
              aria-disabled="true"
              className={`${className} cursor-not-allowed text-white`}
              title="Página ainda não disponível"
            >
              <Icon size={mobile ? 19 : 17} strokeWidth={2.2} />
              <span className={mobile ? "" : "hidden lg:inline"}>{label}</span>
            </span>
          );
        }

        const link = (
          <Link
            key={label}
            href={href}
            aria-label={label}
            title={label}
            aria-current={isActive ? "page" : undefined}
            className={className}
          >
            <Icon size={mobile ? 19 : 17} strokeWidth={2.2} />
            <span className={mobile ? "" : "hidden lg:inline"}>{label}</span>
          </Link>
        );

        return mobile ? (
          <SheetClose key={label} nativeButton={false} render={link} />
        ) : (
          <div key={label}>{link}</div>
        );
      })}
    </nav>
  );
}

export function AppSidebar({ activeItem, admin = false }) {
  return (
    <>
      <Sheet>
        <header
          data-wisen-hover="preserve"
          className="sticky top-0 z-40 flex h-20 items-center justify-between bg-wisen-sidebar px-4 text-white sm:hidden"
        >
          <WisenBrand admin={admin} className="absolute left-1/2 -translate-x-1/2" />
          <SheetTrigger
            aria-label="Abrir menu de navegação"
            className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Menu size={23} strokeWidth={2.2} />
          </SheetTrigger>
        </header>

        <SheetContent
          data-wisen-hover="preserve"
          side="left"
          showCloseButton={false}
          className="w-[min(85vw,300px)] gap-0 border-r-0 bg-wisen-sidebar p-5 text-white"
        >
          <div className="mb-8 flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-white">Navegação</SheetTitle>
            <SheetClose
              aria-label="Fechar menu de navegação"
              className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={21} strokeWidth={2.2} />
            </SheetClose>
          </div>

          <div className="mb-6 flex justify-center border-b border-white/15 pb-4">
            <WisenBrand admin={admin} className="px-3" />
          </div>

          <NavigationItems admin={admin} activeItem={activeItem} mobile />
        </SheetContent>
      </Sheet>

      <aside
        data-wisen-hover="preserve"
        className="fixed top-0 bottom-0 left-0 z-20 hidden w-[76px] flex-col bg-wisen-sidebar px-2.5 py-6 text-white sm:flex lg:w-[240px] lg:px-4"
      >
        <div className="mb-6 flex justify-center border-b border-white/15 pb-4">
          <WisenBrand admin={admin} className="px-1" large />
        </div>

        <NavigationItems admin={admin} activeItem={activeItem} />
      </aside>
    </>
  );
}
