import React from 'react';
import { Send, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2B333F] text-slate-300 border-t border-slate-700/50">
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
              Plataforma completa para monitoramento de custos de IA, gestão de conteúdos e inteligência estratégica para tomada de decisões.
            </p>
            
            {/* Redes Sociais com SVGs Embutidos (Evita erros de versão) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Twitter / X */}
              <a 
                href="#" 
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-[#E8E191] hover:bg-slate-700/80 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="#" 
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-[#E8E191] hover:bg-slate-700/80 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* GitHub */}
              <a 
                href="#" 
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-[#E8E191] hover:bg-slate-700/80 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Coluna 2: Links do Sistema */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="/paginaLanding" className="hover:text-[#E8E191] transition-colors">
                  Início / Landing Page
                </a>
              </li>
              <li>
                <a href="/paginaInicioAdm" className="hover:text-[#E8E191] transition-colors">
                  Painel Administrativo
                </a>
              </li>
              <li>
                <a href="/paginaMonitorIa" className="hover:text-[#E8E191] transition-colors">
                  Monitor de Consumo IA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E8E191] transition-colors">
                  Relatórios & Métricas
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links Legais & Suporte */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suporte & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#" className="hover:text-[#E8E191] transition-colors">
                  Documentação API
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E8E191] transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E8E191] transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#E8E191] transition-colors">
                  Central de Ajuda
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fique Atualizado</h4>
            <p className="text-xs text-slate-400">
              Receba novidades sobre novos modelos de IA e atualizações da plataforma.
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  placeholder="Seu e-mail..." 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E8E191]/40"
                />
              </div>
              <button 
                type="button" 
                className="p-2.5 rounded-xl bg-[#E8E191] text-[#2B333F] font-bold hover:bg-[#dcd581] transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Linha Inferior: Direitos Autorais */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Wisen Inc. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-[#E8E191] fill-[#E8E191]" /> para alta performance.
          </p>
        </div>

      </div>
    </footer>
  );
}