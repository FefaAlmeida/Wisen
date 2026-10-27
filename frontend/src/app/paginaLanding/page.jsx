import React from 'react';
import { HeroLanding } from '@/components/landingPage/heroLanding';
import { ApresentacaoLanding } from '@/components/landingPage/apresentacaoLanding';
import { RecursosLanding } from '@/components/landingPage/recursosLanding';
import { BannerImpacto } from '@/components/landingPage/bannerImpacto';
import { DepoimentosLanding } from '@/components/landingPage/depoimentosLanding';
import { PerguntasFrequentes } from '@/components/landingPage/perguntasFrequentes';

export default function PaginaLanding() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-[#2B333F] selection:bg-[#E8E191] selection:text-[#2B333F]">
     
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-20">
        
        <HeroLanding />

        
        <ApresentacaoLanding />

       
        <RecursosLanding />

        
        <BannerImpacto />

        
        <DepoimentosLanding />

       
        <PerguntasFrequentes />
      </main>

      
      <footer className="w-full border-t border-slate-200 bg-white py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#2B333F]">Wisen</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8E191]" />
            <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#2B333F] transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-[#2B333F] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#2B333F] transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}