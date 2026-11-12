"use client";

import {
  Clock3,
  Compass,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Início", href: "/paginaInicialCliente", icon: Home },
  { label: "Explorar", href: "/paginaExplorar", icon: Compass },
  { label: "Revisões", href: "/paginaSessaoRevisao", icon: Clock3 },
  {
    label: "Meu conhecimento",
    href: "/paginaBiblioteca",
    icon: GraduationCap,
  },
  { label: "Notícias", href: "/paginaEvento", icon: Newspaper },
  { label: "Aprendizado", icon: GraduationCap },
];

function WisenBrand({ className = "", large = false }) {
  return (
    <Link
      href="/paginaInicialCliente"
      className={`inline-flex items-center gap-2.5 text-white ${className}`}
    >
      <Image
        src="/logoWisen-simbolo.png"
        alt="Logo Wisen"
        width={32}
        height={32}
        className="size-7 shrink-0 rounded-lg border border-white/15 bg-[#f3f0e8] object-contain shadow-sm"
      />
      <span className={`text-xl font-bold tracking-tight ${large ? "lg:text-2xl" : ""}`}>
        Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
      </span>
    </Link>
  );
}

function NavigationItems({ activeItem, mobile = false }) {
  return (
    <nav
      aria-label="Navegação principal"
      className={`flex flex-col ${mobile ? "gap-2.5" : "gap-2"}`}
    >
      {navigation.map(({ label, href, icon: Icon }) => {
        const isActive =
          label === activeItem || (activeItem === "Conceitos" && label === "Meu conhecimento");
        const className = mobile
          ? `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
              isActive
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-[#EBDD80] hover:text-[#202D3A] hover:shadow-sm"
            }`
          : `flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] lg:gap-3 lg:px-2.5 lg:text-[12px] ${
              isActive
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-[#EBDD80] hover:text-[#202D3A] hover:shadow-sm"
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

function SettingsLink({ activeItem, mobile = false }) {
  const className = mobile
    ? `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
        activeItem === "Configurações"
          ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
          : "text-white hover:bg-[#EBDD80] hover:text-[#202D3A] hover:shadow-sm"
      }`
    : `mt-auto flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] lg:gap-3 lg:px-2.5 lg:text-[12px] ${
        activeItem === "Configurações"
          ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
          : "text-white hover:bg-[#EBDD80] hover:text-[#202D3A] hover:shadow-sm"
      }`;
  const link = (
    <Link
      href="/paginaPerfil"
      aria-current={activeItem === "Configurações" ? "page" : undefined}
      className={className}
    >
      <Settings size={mobile ? 19 : 17} strokeWidth={2.2} />
      <span>Configurações</span>
    </Link>
  );

  return mobile ? <SheetClose nativeButton={false} render={link} /> : link;
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
      className={`flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] text-white transition-all duration-200 hover:bg-[#EBDD80] hover:text-[#202D3A] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
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
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#202d3a] px-4 text-white sm:hidden">
          <WisenBrand />
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

          <WisenBrand className="mb-6 px-3" />

          <NavigationItems activeItem={activeItem} mobile />
          <div className="mt-2 border-t border-white/10 pt-2">
            <AdminDashboardLink mobile />
          </div>

          <div className="mt-auto border-t border-white/10 pt-4">
            <SettingsLink activeItem={activeItem} mobile />
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className="fixed top-0 bottom-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-6 text-white sm:flex lg:w-[220px] lg:px-4"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <WisenBrand className="mb-8 px-1" large />

        <NavigationItems activeItem={activeItem} />
        <div className="mt-2 border-t border-white/10 pt-2">
          <AdminDashboardLink />
        </div>
        <SettingsLink activeItem={activeItem} />
      </aside>
    </>
  );
}
