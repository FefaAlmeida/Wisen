import { Calendar } from "lucide-react";

export function TopoMonitorIa() {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-2 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          ADMINISTRADOR
        </span>
        <h1 className="text-[32px] leading-tight font-medium tracking-tight text-[#2B333F] md:text-[40px]">
          Monitor de Custos e Consumo de IA
        </h1>
        <p className="text-[15px] leading-6 text-slate-500">
          Acompanhe o uso dos modelos de IA, os custos gerados e o desempenho das requisições.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-2xs transition-colors hover:bg-[#FBF7E5]">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="font-medium">Outubro de 2026</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-[#2B333F] text-sm font-bold text-[#EBDD80] shadow-2xs">
          A
        </div>
      </div>
    </div>
  );
}
