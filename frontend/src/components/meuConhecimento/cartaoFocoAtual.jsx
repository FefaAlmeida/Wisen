import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Landmark, Leaf, Cpu, ArrowRight, Lightbulb } from "lucide-react";

export function CartaoFocoAtual() {
  const focos = [
    {
      id: 1,
      titulo: "Política monetária",
      subtitulo: "3 conceitos para revisar",
      icone: Landmark,
    },
    {
      id: 2,
      titulo: "Mudanças climáticas",
      subtitulo: "4 conceitos para revisar",
      icone: Leaf,
    },
    {
      id: 3,
      titulo: "Inteligência artificial",
      subtitulo: "3 conceitos para revisar",
      icone: Cpu,
    },
  ];

  return (
    <Card className="border border-slate-200/80 shadow-xs bg-white rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#E8E191]/30 text-[#2B333F] rounded-xl shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[#2B333F]">
              Seu foco atual
            </CardTitle>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Com base no seu desempenho, sugerimos que você foque nestes temas.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lista de Temas Sugeridos */}
        <div className="space-y-2">
          {focos.map((item) => {
            const Icone = item.icone;
            return (
              <button
                key={item.id}
                type="button"
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-[#2B333F] rounded-lg group-hover:bg-[#E8E191]/40 transition-colors">
                    <Icone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#2B333F] group-hover:text-black">
                      {item.titulo}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.subtitulo}
                    </p>
                  </div>
                </div>
                <div className="p-1 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#E8E191] group-hover:text-[#2B333F] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quadro Amarelo de Mensagem de Incentivo */}
        <div className="p-4 bg-[#E8E191]/25 border border-[#E8E191]/60 rounded-xl flex items-start gap-3">
          <div className="p-1.5 bg-[#E8E191] text-[#2B333F] rounded-lg shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 fill-[#2B333F]" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-[#2B333F]">
              Continue assim!
            </h5>
            <p className="text-[11px] text-slate-600 leading-normal">
              Você evoluiu <strong>18%</strong> no seu mastery score neste mês. Mantenha a constância nas leituras e revisões.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}