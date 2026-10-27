import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Layers, Network, TrendingUp } from "lucide-react";

export function HeroLanding() {
  return (
    <section 
      className="relative w-full py-10 md:py-0  bg-cover bg-right "
      style={{ backgroundImage: "url('/heroFundo.png')" }}
      id="inicio"
    >
    
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent w-full md:w-1/2 pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[460px]">
          
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              A inteligência para um Brasil e o mundo
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2B333F] tracking-tight leading-[1.1]">
              Entenda o mundo.<br />
              Construa o <span className="relative">
                seu
                <span className="inline-block w-3 h-3 rounded-full bg-[#E8E191] ml-1" />
              </span>
            </h1>

            <p className="text-base text-slate-600 max-w-lg leading-relaxed">
              O Wisen transforma complexidade em aprendizado, com explicações claras, conexões personalizadas e o seu mundo completo ao seu alcance.
            </p>

            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button className="bg-[#2B333F] hover:bg-[#1f252e] text-white text-xs font-semibold px-6 h-12 rounded-2xl shadow-md gap-2 transition-all cursor-pointer">
                <span>Começar agora</span>
                <ArrowRight className="w-4 h-4 text-[#E8E191]" />
              </Button>

              <Button 
                variant="outline" 
                className="border-slate-200 bg-white/80 backdrop-blur-xs text-[#2B333F] hover:bg-slate-100 text-xs font-semibold px-6 h-12 rounded-2xl gap-2 transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#E8E191] flex items-center justify-center shrink-0">
                  <Play className="w-3 h-3 text-[#2B333F] fill-[#2B333F] ml-0.5" />
                </div>
                <span>Ver como funciona</span>
              </Button>
            </div>
          </div>

        
          <div className="lg:col-span-6 relative h-80 lg:h-[440px] flex items-center justify-center">
            
       
            <div className="absolute top-4 right-0 md:right-4 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 z-10 max-w-xs">
              <div className="p-2.5 bg-[#2B333F] text-white rounded-xl shrink-0">
                <Layers className="w-4 h-4 text-[#E8E191]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2B333F]">Coleções em progresso</h4>
                <p className="text-[10px] text-slate-500">Temas que importam para você</p>
              </div>
            </div>

           
            <div className="absolute top-1/2 left-0 lg:-left-6 -translate-y-1/2 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 z-10">
              <div className="p-2.5 bg-[#E8E191] text-[#2B333F] rounded-xl shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#2B333F]">Mapas mentais</span>
            </div>

            
            <div className="absolute bottom-6 right-2 md:right-6 bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-2xl p-3.5 flex items-center gap-3 z-10">
              <div className="p-2.5 bg-[#2B333F] text-white rounded-xl shrink-0">
                <TrendingUp className="w-4 h-4 text-[#E8E191]" />
              </div>
              <span className="text-xs font-bold text-[#2B333F]">Dados e tendências</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}