"use client";

import {
  Clock3,
  Compass,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Início", href: "/paginaInicialCliente", icon: Home },
  { label: "Explorar", href: "/paginaExplorar", icon: Compass },
  { label: "Revisões", href: "/paginaRevisoes", icon: Clock3 },
  {
    label: "Meu conhecimento",
    href: "/paginaBiblioteca",
    icon: GraduationCap,
  },
  { label: "Notícias", href: "/paginaExplorar", icon: Newspaper },
  { label: "Salvos", href: "/paginaGuardados", icon: GraduationCap },
];

function WisenBrand({ className = "", large = false }) {
  return (
    <Link
      href="/paginaInicialCliente"
      className={`inline-flex flex-col items-center gap-1.5 text-white ${className}`}
    >
      <Image
        src="/logoWisen-simbolo.png"
        alt="Logo Wisen"
        width={44}
        height={44}
        className="size-10 shrink-0 rounded-full border border-white/15 bg-[#f3f0e8] object-contain shadow-sm lg:size-11"
      />
      <span className={`text-xl font-bold tracking-tight ${large ? "lg:text-2xl" : ""}`}>
        Wisen
      </span>
    </Link>
  );
}

function NavigationItems({ activeItem, mobile = false }) {
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-2.5">
      {navigation.map(({ label, href, icon: Icon }) => {
        const isActive =
          label === activeItem || (activeItem === "Conceitos" && label === "Meu conhecimento");
        const className = mobile
          ? `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
              isActive
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-white/10"
            }`
          : `flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] lg:gap-3 lg:px-2.5 lg:text-[12px] ${
              isActive
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
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
              <span>{label}</span>
            </span>
          );
        }

        const link = (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={className}
          >
            <Icon size={mobile ? 19 : 17} strokeWidth={2.2} />
            <span>{label}</span>
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

function AdminDashboardLink({ mobile = false }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminRole() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Não foi possível verificar a sessão (HTTP ${response.status}).`);
        }
        const { user } = await response.json();
        if (active) setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error("Não foi possível verificar o acesso administrativo.", error);
      }
    }

    checkAdminRole();
    return () => {
      active = false;
    };
  }, []);

  if (!isAdmin) return null;

  const link = (
    <Link
      href="/paginaInicioAdm"
      className={`flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
        mobile ? "h-11 gap-3 px-3 text-sm" : "lg:gap-3 lg:px-2.5 lg:text-[12px]"
      }`}
    >
      <LayoutDashboard size={mobile ? 19 : 17} strokeWidth={2.2} />
      <span>Painel administrativo</span>
    </Link>
  );

  return mobile ? <SheetClose nativeButton={false} render={link} /> : link;
}

export default function Sidebar({ activeItem }) {
  return (
    <>
      <Sheet>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-[#202d3a] px-4 text-white sm:hidden">
          <WisenBrand className="absolute left-1/2 -translate-x-1/2" />
          <SheetTrigger
            aria-label="Abrir menu de navegação"
            className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Menu size={23} strokeWidth={2.2} />
          </SheetTrigger>
        </header>

        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(85vw,300px)] gap-0 border-r-0 bg-[#202d3a] p-5 text-white"
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
            <WisenBrand className="px-3" />
          </div>

          <NavigationItems activeItem={activeItem} mobile />
          <div className="mt-2 border-t border-white/10 pt-2">
            <AdminDashboardLink mobile />
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className="fixed top-0 bottom-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-6 text-white sm:flex lg:w-[220px] lg:px-4"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <div className="mb-6 flex justify-center border-b border-white/15 pb-4">
          <WisenBrand className="px-1" large />
        </div>

        <NavigationItems activeItem={activeItem} />
        <div className="mt-2 border-t border-white/10 pt-2">
          <AdminDashboardLink />
        </div>
      </aside>
    </>
  );
}
