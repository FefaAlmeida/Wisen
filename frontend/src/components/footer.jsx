import { Heart } from "lucide-react";
import Link from "next/link";

export function Footer({ variant = "plataforma", background = "bg-[#F0F4F9]" }) {
  if (variant === "cliente" || variant === "admin") {
    return (
      <footer className={`relative z-10 w-full ${background} text-[#607092]`}>
        <div className="mx-auto max-w-7xl px-6 py-7 text-center md:px-8">
          <div className="border-t border-[#DCE3ED] pt-6">
            <p className="text-[11px]">© 2026 Wisen. Todos os direitos reservados.</p>
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
                  href={variant === "admin" ? "/paginaInicioAdm" : "/paginaInicialCliente"}
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
