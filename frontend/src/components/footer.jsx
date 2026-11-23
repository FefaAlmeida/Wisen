import Image from "next/image";
import Link from "next/link";

export function Footer({
  variant = "plataforma",
  background = "bg-wisen-superficie",
  sidebarOffset = variant === "cliente",
}) {
  if (variant === "cliente" || variant === "admin") {
    return (
      <footer
        className={`relative z-10 w-full ${background} text-[#607092} ${
          sidebarOffset ? "sm:ml-[76px] sm:w-auto lg:ml-[240px]" : ""
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-7 text-center md:px-8">
          <div className="border-t border-[#DCE3ED] pt-6">
            <p className="text-[11px]">© 2026 Wisen. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-0 border-t border-white/10 bg-[#0C142B] text-[#BDCADB]">
      <div className="mx-auto max-w-[1360px] px-6 py-8 sm:px-10 md:px-14 md:py-10">
        {/* Grade Principal de Conteúdo */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-7 md:flex-row md:gap-16">
          {/* Coluna 1: Marca & Resumo do Sistema */}
          <div className="max-w-[420px] space-y-4">
            <Link
              href="/"
              aria-label="Wisen, página inicial"
              className="inline-flex items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
            >
              <Image
                src="/logoWisen-simbolo-v1.webp"
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <span className="text-[2rem] font-bold tracking-[-0.06em] text-white">Wisen</span>
            </Link>
            <p className="text-base leading-[1.75]">
              Notícias, conceitos e revisões para entender melhor o mundo e acompanhar seu
              aprendizado.
            </p>
          </div>

          <nav aria-label="Conheça o Wisen" className="space-y-4 md:min-w-[200px] md:pt-1">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8E191]">
              Conheça o Wisen
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/auth"
                  className="rounded-sm transition-colors hover:text-[#E8E191] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
                >
                  Criar conta
                </Link>
              </li>
              <li>
                <Link
                  href="/#sobre"
                  className="rounded-sm transition-colors hover:text-[#E8E191] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
                >
                  Como funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="rounded-sm transition-colors hover:text-[#E8E191] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8E191]"
                >
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Linha Inferior: Direitos Autorais */}
        <div className="pt-5 text-xs text-[#AEBED3]">
          <p>© 2026 Wisen. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
