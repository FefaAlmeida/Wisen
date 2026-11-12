"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock3,
  Compass,
  GraduationCap,
  Home,
  Menu,
  Newspaper,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
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

function NavigationItems({ activeItem, mobile = false }) {
  return (
    <nav
      aria-label="Navegação principal"
      className={`flex flex-col ${mobile ? "gap-2" : "gap-1.5"}`}
    >
      {navigation.map(({ label, href, icon: Icon }) => {
        const isActive =
          label === activeItem || (activeItem === "Conceitos" && label === "Meu conhecimento");
        const className = mobile
          ? `flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors ${
              isActive
                ? "bg-wisen-selecao font-semibold text-wisen-texto-selecao"
                : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
            }`
          : `flex h-10 items-center gap-2 rounded-md px-2 text-[10px] transition-colors lg:gap-3 lg:px-2.5 lg:text-[12px] ${
              isActive
                ? "bg-wisen-selecao font-semibold text-wisen-texto-selecao"
                : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
            }`;

        if (!href) {
          return (
            <span
              key={label}
              aria-disabled="true"
              className={`${className} cursor-not-allowed text-[#c5ced8]/60`}
              title="Página ainda não disponível"
            >
              <Icon size={mobile ? 19 : 17} strokeWidth={1.8} />
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
            <Icon size={mobile ? 19 : 17} strokeWidth={1.8} />
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
    ? `flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors ${
        activeItem === "Configurações"
          ? "bg-wisen-selecao font-semibold text-wisen-texto-selecao"
          : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
      }`
    : `mt-auto flex h-10 items-center gap-2 rounded-md px-2 text-[10px] transition-colors lg:gap-3 lg:px-2.5 lg:text-[12px] ${
        activeItem === "Configurações"
          ? "bg-wisen-selecao font-semibold text-wisen-texto-selecao"
          : "text-[#c5ced8] hover:bg-white/10 hover:text-white"
      }`;
  const link = (
    <Link
      href="/paginaPerfil"
      aria-current={activeItem === "Configurações" ? "page" : undefined}
      className={className}
    >
      <Settings size={mobile ? 19 : 17} strokeWidth={1.8} />
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
      className={`flex h-10 items-center gap-2 rounded-md px-2 text-[10px] text-[#c5ced8] transition-colors hover:bg-white/10 hover:text-white ${
        mobile ? "h-11 gap-3 px-3 text-sm" : "lg:gap-3 lg:px-2.5 lg:text-[12px]"
      }`}
    >
      <LayoutDashboard size={mobile ? 19 : 17} strokeWidth={1.8} />
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
          <Link href="/paginaInicialCliente" className="text-xl font-bold tracking-tight">
            Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
          </Link>
          <SheetTrigger
            aria-label="Abrir menu de navegação"
            className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Menu size={23} />
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
              <X size={21} />
            </SheetClose>
          </div>

          <Link href="/paginaInicialCliente" className="mb-6 px-3 text-lg font-bold tracking-tight">
            Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
          </Link>

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
        className="fixed top-0 bottom-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-5 text-white sm:flex lg:w-[220px] lg:px-4"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <Link
          href="/paginaInicialCliente"
          className="mb-8 px-1 text-[20px] font-bold tracking-tight lg:text-[24px]"
        >
          Wisen<span className="align-top text-[9px] text-[#f3d96b]">•</span>
        </Link>

        <NavigationItems activeItem={activeItem} />
        <div className="mt-2 border-t border-white/10 pt-2">
          <AdminDashboardLink />
        </div>
        <SettingsLink activeItem={activeItem} />
      </aside>
    </>
  );
}
