import { Calendar } from "lucide-react";
import React from "react";

export function TopoMonitorIa() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          ADMINISTRADOR
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-[#2B333F] tracking-tight">
          Monitor de Custos e Consumo de IA
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Acompanhe o uso dos modelos de IA, os custos gerados e o desempenho das requisições.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Outubro de 2026</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#2B333F] text-[#E8E191] font-bold text-xs flex items-center justify-center border border-slate-700 shadow-2xs">
          A
        </div>
      </div>
    </div>
  );
}
