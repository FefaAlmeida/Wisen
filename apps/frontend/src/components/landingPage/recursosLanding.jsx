import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ShieldCheck, 
  Network, 
  BarChart3, 
  Bookmark, 
  Sparkles, 
  ArrowRight,
  ChevronRight
} from "lucide-react";

export function RecursosLanding() {
  const recursos = [
    {
      id: 1,
      titulo: "Explicação simples",
      descricao: "Um olhar simplificado, com linguagem acessível para qualquer perfil de público.",
      icone: BookOpen,
      corIcone: "bg-pink-50 text-pink-600",
    },
    {
      id: 2,
      titulo: "Conexão confiável",
      descricao: "Fontes de qualidade, com curadoria e análise para a sua escolha.",
      icone: ShieldCheck,
      corIcone: "bg-amber-50 text-amber-600",
    },
    {
      id: 3,
      titulo: "Mapas de conhecimento",
      descricao: "Veja a relação entre ideias, temas e o conhecimento de forma visual.",
      icone: Network,
      corIcone: "bg-indigo-50 text-indigo-600",
    },
    {
      id: 4,
      titulo: "Resumo sob medida",
      descricao: "Aprendizado no seu ritmo, com o nível de profundidade que você precisa.",
      icone: BarChart3,
      corIcone: "bg-emerald-50 text-emerald-600",
    },
    {
      id: 5,
      titulo: "Guardados",
      descricao: "Salve conteúdos e construa seu conhecimento com total personalização.",
      icone: Bookmark,
      corIcone: "bg-sky-50 text-sky-600",
    },
    {
      id: 6,
      titulo: "Temas que você gosta",
      descricao: "Receba novas perspetivas sobre os assuntos que realmente importam.",
      icone: Sparkles,
      corIcone: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section className="py-12 border-t border-slate-100" id="funcionalidades">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            FUNCIONALIDADES
          </span>

          <h2 className="text-3xl md:text-4xl font-black text-[#2B333F] tracking-tight leading-tight">
            Tudo o que você precisa para entender mais e <span className="border-b-4 border-[#E8E191]">ir além.</span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Ferramentas essenciais para transformar informação em aprendizado real.
          </p>

          <Button className="bg-[#2B333F] hover:bg-[#1f252e] text-white text-xs font-semibold px-6 h-12 rounded-2xl gap-2 shadow-md transition-all cursor-pointer">
            <span>Explorar todas as funcionalidades</span>
            <ArrowRight className="w-4 h-4 text-[#E8E191]" />
          </Button>
        </div>

        
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recursos.map((item) => {
            const Icone = item.icone;
            return (
              <div 
                key={item.id}
                className="p-6 bg-white rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl shrink-0 ${item.corIcone}`}>
                      <Icone className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2B333F] group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[#2B333F] group-hover:text-black">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}