import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Target, Flame, TrendingUp } from "lucide-react";

export function CartoesEstatisticas() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Cartão 1: Conceitos dominados */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E8E191]/40 rounded-full text-[#2B333F]">
                <GraduationCap className="w-5 h-5 text-[#2B333F]" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                Conceitos dominados
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
              <TrendingUp className="w-3 h-3" />
              <span>+12</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-3xl font-extrabold text-[#2B333F]">128</span>
              <span className="text-xs text-slate-400 ml-2">de 212 conceitos</span>
            </div>
            <span className="text-[11px] text-slate-400">neste mês</span>
          </div>
        </CardContent>
      </Card>

      {/* Cartão 2: Lacunas superadas no mês */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-full text-[#2B333F]">
                <Target className="w-5 h-5 text-[#2B333F]" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                Lacunas superadas no mês
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
              <TrendingUp className="w-3 h-3" />
              <span>+13%</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-3xl font-extrabold text-[#2B333F]">24</span>
              <span className="text-xs text-slate-400 ml-2">conceitos revisados</span>
            </div>
            <span className="text-[10px] text-slate-400 max-w-[90px] text-right leading-tight">
              em relação ao mês anterior
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cartão 3: Dias consecutivos de leitura */}
      <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#E8E191]/40 rounded-full text-[#2B333F]">
                <Flame className="w-5 h-5 text-[#2B333F]" />
              </div>
              <span className="text-xs font-medium text-slate-500">
                Dias consecutivos de leitura
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-3xl font-extrabold text-[#2B333F]">7</span>
              <span className="text-xs text-slate-400 ml-2">dias seguidos</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#2B333F] bg-[#E8E191]/30 px-3 py-1.5 rounded-xl">
              <Flame className="w-3.5 h-3.5 fill-[#2B333F]" />
              <span>Sua maior sequência: 12</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}