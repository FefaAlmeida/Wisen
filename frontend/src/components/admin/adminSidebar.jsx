"use client";

import {
  Activity,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Rss,
  Tags,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { requisitar } from "@/services/api";

const navigation = [
  { label: "Visão geral", href: "/paginaInicioAdm", icon: LayoutDashboard },
  { label: "Curadoria de eventos", href: "/paginaCuidadoriaEventosAdm", icon: Newspaper },
  { label: "Gestão de usuários", href: "/paginaGestaoUsuariosAdm", icon: Users },
  { label: "Gestão de fontes", href: "/paginaGestaoFonteAdm", icon: Rss },
  { label: "Gestão de categorias", href: "/paginaGestaoCategoriasAdm", icon: Tags },
  { label: "Monitor de IA", href: "/paginaMonitorIa", icon: Activity },
];

function AdminBrand({ className = "", large = false }) {
  return (
    <Link
      href="/paginaInicioAdm"
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

function NavigationLinks({ activeItem, mobile = false }) {
  return (
    <nav aria-label="Navegação administrativa" className="flex flex-col gap-2.5">
      {navigation.map(({ label, href, icon: Icon }) => {
        const className = mobile
          ? `flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] ${
              label === activeItem
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-white/10"
            }`
          : `flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-[10px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EBDD80] lg:gap-3 lg:px-2.5 lg:text-[12px] ${
              label === activeItem
                ? "bg-[#EBDD80] font-semibold text-[#202D3A] shadow-sm"
                : "text-white hover:bg-white/10"
            }`;
        const link = (
          <Link
            key={href}
            href={href}
            aria-current={label === activeItem ? "page" : undefined}
            className={className}
          >
            <Icon size={mobile ? 19 : 17} strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        );

        return mobile ? (
          <SheetClose key={href} nativeButton={false} render={link} />
        ) : (
          <div key={href}>{link}</div>
        );
      })}
    </nav>
  );
}

function AdminLogout() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await requisitar("/auth/logout", { method: "POST" });
      window.location.assign("/paginaLogin");
    } catch {
      setError("Não foi possível sair da conta. Tente novamente.");
      setPending(false);
    }
  }

  return (
    <div className="mt-auto border-t border-white/15 pt-4">
      <button
        type="button"
        onClick={logout}
        disabled={pending}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-xs text-white hover:bg-white/10 disabled:opacity-50"
      >
        <LogOut size={17} />
        {pending ? "Saindo…" : "Sair da conta"}
      </button>
      {error && (
        <p role="alert" className="px-2.5 text-xs text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}

export function AdminSidebar({ activeItem }) {
  return (
    <>
      <Sheet>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-[#202d3a] px-4 text-white sm:hidden">
          <AdminBrand className="absolute left-1/2 -translate-x-1/2" />
          <SheetTrigger
            aria-label="Abrir menu administrativo"
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
              aria-label="Fechar menu administrativo"
              className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={21} strokeWidth={2.2} />
            </SheetClose>
          </div>
          <div className="mb-6 flex justify-center border-b border-white/15 pb-4">
            <AdminBrand className="px-3" />
          </div>
          <NavigationLinks activeItem={activeItem} mobile />
          <AdminLogout />
        </SheetContent>
      </Sheet>

      <aside
        className="fixed top-0 bottom-0 left-0 z-20 hidden w-[128px] flex-col bg-[#202d3a] px-2.5 py-6 text-white sm:flex lg:w-[220px] lg:px-4"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <div className="mb-6 flex justify-center border-b border-white/15 pb-4">
          <AdminBrand className="px-1" large />
        </div>
        <NavigationLinks activeItem={activeItem} />
        <AdminLogout />
      </aside>
    </>
  );
}
