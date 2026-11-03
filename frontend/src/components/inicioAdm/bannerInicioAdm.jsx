import React from 'react';

export function BannerInicioAdm() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#181F2A] via-[#2B333F] to-[#181F2A] text-white p-8 md:p-10 shadow-xl border border-slate-800">
      
      {/* Imagem de Fundo (Globo) */}
      <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none opacity-40">
        <img 
          src="/heroFundo.png" 
          alt="Globo Admin" 
          className="w-full h-full object-cover object-left"
        />
      </div>

      <div className="relative z-10 space-y-2 max-w-xl">
        <span className="text-[10px] font-bold tracking-widest text-[#E8E191] uppercase">
          PAINEL ADMINISTRATIVO
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Visão completa do <span className="text-[#E8E191]">Wisen.</span>
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Acompanhe o desempenho dos usuários, gerencie conteúdos e monitore os principais temas do momento.
        </p>
      </div>
    </div>
  );
}