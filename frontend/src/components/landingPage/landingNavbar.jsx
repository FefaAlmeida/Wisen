import Image from "next/image";
import Link from "next/link";

export function LandingNavbar({ headerRef, isScrolled = false, isOverLightSection = false }) {
  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-20 px-4 ${
        isScrolled ? "pt-2" : "pt-4"
      } transition-all duration-300 sm:px-6 lg:px-8 xl:px-12`}
    >
      <div
        className={`mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/20 ${
          isOverLightSection ? "bg-[#101A40]/95" : "bg-white/5"
        } px-4 ${
          isScrolled ? "py-2" : "py-3"
        } shadow-[0_12px_26px_-18px_rgba(7,13,31,0.75)] backdrop-blur-md transition-all duration-300 md:flex-nowrap md:rounded-full sm:px-5 lg:px-6`}
      >
        <Link
          href="/"
          aria-label="Wisen, página inicial"
          className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
        >
          <Image
            src="/logoWisen-simbolo-v1.webp"
            alt=""
            width={48}
            height={48}
            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
          />
          <span className="text-2xl font-bold leading-none tracking-[-0.06em] text-white sm:text-[1.7rem]">
            Wisen
          </span>
        </Link>

        <nav
          aria-label="Navegação da plataforma"
          className="flex items-center justify-between gap-2"
        >
          <Link
            href="/auth"
            className="rounded-full bg-[#E8E191] px-4 py-2 text-sm font-semibold text-[#101A40] shadow-[0_12px_20px_-12px_rgba(232,225,145,0.9)] transition-all duration-200 hover:bg-[#F3EB9B]"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
