"use client";

import {
  Activity,
  LayoutDashboard,
  Menu,
  Newspaper,
  Rss,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Visão geral", href: "/paginaInicioAdm", icon: LayoutDashboard },
  { label: "Curadoria de eventos", href: "/paginaCuidadoriaEventosAdm", icon: Newspaper },
  { label: "Gestão de usuários", href: "/paginaGestaoUsuariosAdm", icon: Users },
  { label: "Gestão de fontes", href: "/paginaGestaoFonteAdm", icon: Rss },
  { label: "Monitor de IA", href: "/paginaMonitorIa", icon: Activity },
];

function NavigationLinks({ activeItem, mobile = false }) {
  return (
    <nav aria-label="Navegação administrativa" className="flex flex-col gap-1.5">
      {navigation.map(({ label, href, icon: Icon }) => {
        const className = `flex min-h-11 items-center gap-3 rounded-lg px-3 transition-colors ${
          mobile ? "text-sm" : "text-[11px] lg:text-xs"
        } ${
          label === activeItem
            ? "bg-[#E8E191] font-semibold text-[#202d3a]"
            : "text-[#d1d9e2] hover:bg-white/10 hover:text-white"
        }`;
        const link = (
          <Link
            key={href}
            href={href}
            aria-current={label === activeItem ? "page" : undefined}
            className={className}
          >
            <Icon size={18} strokeWidth={1.8} />
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

export function AdminSidebar({ activeItem }) {
  return (
    <>
      <Sheet>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-[#202d3a] px-4 text-white sm:hidden">
          <Link href="/paginaInicioAdm" className="text-xl font-bold tracking-tight">
            Wisen<span className="align-top text-[9px] text-[#E8E191]">•</span>
            <span className="ml-2 text-xs font-medium text-[#c5ced8]">Admin</span>
          </Link>
          <SheetTrigger
            aria-label="Abrir menu administrativo"
            className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Menu size={23} />
          </SheetTrigger>
        </header>

        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[min(85vw,320px)] gap-0 border-r-0 bg-[#202d3a] p-5 text-white"
        >
          <div className="mb-9 flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-white">Wisen Admin</SheetTitle>
            <SheetClose
              aria-label="Fechar menu administrativo"
              className="flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={21} />
            </SheetClose>
          </div>
          <NavigationLinks activeItem={activeItem} mobile />
        </SheetContent>
      </Sheet>

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col bg-[#202d3a] px-4 py-6 text-white sm:flex">
        <Link href="/paginaInicioAdm" className="mb-9 px-3 text-2xl font-bold tracking-tight">
          Wisen<span className="align-top text-[9px] text-[#E8E191]">•</span>
          <span className="ml-2 text-xs font-medium text-[#c5ced8]">Admin</span>
        </Link>
        <NavigationLinks activeItem={activeItem} />
      </aside>
    </>
  );
}
