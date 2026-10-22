import React from 'react';

export function CabecalhoConhecimento() {
  return (
    <div>
      <span className="text-xs font-bold tracking-wider text-[#2B333F]/60 uppercase flex items-center gap-1">
        BOM DIA, NATÁLIA ☀️
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-[#2B333F] mt-1">
        Meu <span className="text-[#2B333F] border-b-4 border-[#E8E191]">conhecimento</span>
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Acompanhe sua evolução e entenda como seu aprendizado está avançando.
      </p>
    </div>
  );
}