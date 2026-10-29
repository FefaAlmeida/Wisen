"use client";

import { BookOpen, Home, LogOut, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { requisitar } from "@/services/api";

const links = [
  { label: "Início", href: "/paginaInicialCliente", icon: Home },
  { label: "Biblioteca", href: "/paginaBiblioteca", icon: BookOpen },
  { label: "Notícias", href: "/paginaEvento", icon: Newspaper },
];
const privatePaths = [
  "/",
  "/paginaInicialCliente",
  "/paginaBiblioteca",
  "/paginaConceito",
  "/paginaConhecimento",
  "/paginaEvento",
  "/paginaGuardados",
  "/paginaRevisoes",
  "/paginaPerfil",
];

export default function PrivateNavigation() {
  const pathname = usePathname();
  const isPrivate = privatePaths.some((path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`),
  );
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPrivate) return;
    requisitar("/auth/session")
      .then(({ user: sessionUser }) => setUser(sessionUser))
      .catch(() => setUser(null));
  }, [isPrivate]);

  async function logout() {
    setLoggingOut(true);
    try {
      await requisitar("/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/paginaLogin");
    }
  }

  if (!isPrivate) return null;

  return (
    <header className="sticky top-0 z-40 flex h-[52px] items-center justify-between border-b border-[#dce3ed] bg-white px-3 text-[#253452] shadow-sm sm:px-5">
      <Link href="/paginaInicialCliente" className="shrink-0 text-lg font-bold tracking-tight">
        Wisen<span className="ml-0.5 text-[#e0c43f]">•</span>
      </Link>

      <nav aria-label="Navegação principal" className="flex items-center gap-1 sm:gap-2">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={label}
              className={`flex h-9 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs ${active ? "bg-[#fff2bc] text-[#25303c]" : "text-[#71809c] hover:bg-[#f1f3f6] hover:text-[#253452]"}`}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span className="hidden max-w-36 truncate text-xs text-[#71809c] sm:block">
          {user?.name ?? "Minha conta"}
        </span>
        <button
          type="button"
          aria-label="Sair"
          onClick={logout}
          disabled={loggingOut}
          className="flex h-9 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium text-[#52617a] transition-colors hover:bg-[#f1f3f6] hover:text-[#253452] disabled:opacity-60 sm:px-3 sm:text-xs"
        >
          <LogOut size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
