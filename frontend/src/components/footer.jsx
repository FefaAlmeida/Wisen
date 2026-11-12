import { Heart } from "lucide-react";
import Link from "next/link";

const clienteExploreLinks = [
  { label: "Início", href: "/paginaInicialCliente" },
  { label: "Explorar notícias", href: "/paginaExplorar" },
  { label: "Biblioteca de conceitos", href: "/paginaBiblioteca" },
  { label: "Guardados", href: "/paginaGuardados" },
];

const clienteLearningLinks = [
  { label: "Revisões", href: "/paginaRevisoes" },
  { label: "Meu conhecimento", href: "/paginaConhecimento" },
  { label: "Meu perfil", href: "/paginaPerfil" },
];

export function Footer({ variant = "plataforma" }) {
  if (variant === "cliente") {
    return (
      <footer className="relative z-10 w-full border-t border-slate-700/50 bg-[#2B333F] text-slate-300">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
          <div className="grid gap-8 border-b border-slate-700/60 pb-7 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div className="max-w-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-white">Wisen</span>
                <span className="size-2 rounded-full bg-[#E8E191]" />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Notícias, conceitos e revisões para você entender melhor o mundo e acompanhar seu
                aprendizado.
              </p>
            </div>

            <nav aria-label="Explorar conteúdo">
              <h2 className="text-xs font-semibold text-white">Explorar</h2>
              <ul className="mt-3 space-y-2">
                {clienteExploreLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-slate-400 transition-colors hover:text-[#E8E191]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Aprendizado e conta">
              <h2 className="text-xs font-semibold text-white">Aprendizado e conta</h2>
              <ul className="mt-3 space-y-2">
                {clienteLearningLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-slate-400 transition-colors hover:text-[#E8E191]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col gap-2 pt-5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Wisen</p>
            <p>Seu aprendizado, conectado ao que acontece no mundo.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#2B333F] text-slate-300 border-t border-slate-700/50 mt-0">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Grade Principal de Conteúdo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          {/* Coluna 1: Marca & Resumo do Sistema */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-white tracking-tight">Wisen</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8E191]" />
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Notícias, conceitos e revisões para entender melhor o mundo e acompanhar seu
              aprendizado.
            </p>
          </div>

          {/* Coluna 2: Links do Sistema */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#E8E191] transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/paginaLogin" className="hover:text-[#E8E191] transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link
                  href="/paginaInicialCliente"
                  className="hover:text-[#E8E191] transition-colors"
                >
                  Acessar plataforma
                </Link>
              </li>
            </ul>
          </div>

          <nav aria-label="Conheça o Wisen" className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Conheça o Wisen
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/paginaCadastro" className="hover:text-[#E8E191]">
                  Criar conta
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="hover:text-[#E8E191]">
                  Como funciona
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#E8E191]">
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Linha Inferior: Direitos Autorais */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Wisen Inc. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-[#E8E191] fill-[#E8E191]" /> para
            alta performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
