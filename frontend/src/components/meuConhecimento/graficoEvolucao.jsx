"use client";

import { Info, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GraficoEvolucao() {
  const [periodo, setPeriodo] = useState("30dias");

  // Pontos do gráfico (x, y) proporcional ao SVG (viewBox 0 0 500 150)
  const pontos = "0,110 50,105 100,95 150,80 200,75 250,70 300,65 350,55 400,45 450,35 500,25";
  const areaPreenchimento = `0,150 ${pontos} 500,150`;

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-4">
        {/* Título com Ícone de Informação */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8E191]" />
          <CardTitle className="text-base font-bold text-[#2B333F] flex items-center gap-1.5">
            Evolução do mastery score
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" />
          </CardTitle>
        </div>

        {/* Botões de Seleção de Período */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl text-xs font-medium text-slate-500">
          {[
            { id: "7dias", label: "7 dias" },
            { id: "30dias", label: "30 dias" },
            { id: "3meses", label: "3 meses" },
            { id: "1ano", label: "1 ano" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriodo(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodo === item.id
                  ? "bg-[#E8E191] text-[#2B333F] font-semibold shadow-xs"
                  : "hover:text-[#2B333F]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Área Visual do Gráfico */}
        <div className="relative w-full h-52 pt-2">
          {/* Badge Flutuante do Valor Atual */}
          <div className="absolute right-4 top-2 bg-white/95 border border-slate-200 shadow-sm rounded-xl p-2.5 text-center z-10">
            <span className="text-xl font-extrabold text-[#2B333F] block leading-none">72</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              +8 neste mês
            </span>
          </div>

          {/* Gráfico SVG */}
          <div className="w-full h-40 relative">
            <svg
              role="img"
              aria-label="Exemplo de evolução do domínio ao longo dos últimos sete dias"
              viewBox="0 0 500 150"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="gradienteMastery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8E191" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#E8E191" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" />

              <polygon points={areaPreenchimento} fill="url(#gradienteMastery)" />

              <polyline
                fill="none"
                stroke="#2B333F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pontos}
              />

              {[
                { x: 0, y: 110 },
                { x: 100, y: 95 },
                { x: 200, y: 75 },
                { x: 300, y: 65 },
                { x: 400, y: 45 },
                { x: 500, y: 25 },
              ].map((pt) => (
                <circle
                  key={pt.x}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-[#E8E191] stroke-[#2B333F] stroke-2"
                />
              ))}
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1 mt-2">
            <span>1 abr</span>
            <span>5 abr</span>
            <span>10 abr</span>
            <span>15 abr</span>
            <span>20 abr</span>
            <span>25 abr</span>
            <span>30 abr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
