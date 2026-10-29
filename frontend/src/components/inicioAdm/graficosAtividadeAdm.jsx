import React from 'react';
import { UserPlus, FileText, Globe, BrainCircuit, BarChart2 } from "lucide-react";

export function GraficosAtividadeAdm() {
  const temas = [
    { nome: "Economia", pct: "28%", cor: "bg-[#E8E191]" },
    { nome: "Meio ambiente", pct: "22%", cor: "bg-[#2B333F]" },
    { nome: "Tecnologia", pct: "18%", cor: "bg-[#4B5563]" },
    { nome: "Saúde", pct: "12%", cor: "bg-[#9CA3AF]" },
    { nome: "Política", pct: "10%", cor: "bg-[#CBD5E1]" },
    { nome: "Sociedade", pct: "10%", cor: "bg-[#E2E8F0]" },
  ];

  const atividades = [
    { icone: UserPlus, texto: "Novo usuário cadastrado", tempo: "há 5 minutos" },
    { icone: FileText, texto: "Conteúdo publicado", tempo: "há 32 minutos" },
    { icone: Globe, texto: "Evento atualizado", tempo: "há 1 hora" },
    { icone: BrainCircuit, texto: "Conceito adicionado", tempo: "há 2 horas" },
    { icone: BarChart2, texto: "Relatório gerado", tempo: "há 3 horas" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Gráfico de Linha (Evolução de Usuários) */}
      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#2B333F]">Evolução de usuários ativos</h3>
            <p className="text-[10px] text-slate-400">Comparativo dos últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-[#2B333F]">
              <span className="w-2 h-2 rounded-full bg-[#E8E191]" /> Ativos
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Novos
            </span>
          </div>
        </div>

        {/* Gráfico SVG de Linha/Área */}
        <div className="h-44 w-full pt-4 flex flex-col justify-between relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#F1F5F9" strokeWidth="1" />

            <path 
              d="M 0 90 Q 80 80, 160 65 T 320 50 T 400 40" 
              fill="none" 
              stroke="#CBD5E1" 
              strokeWidth="2.5" 
            />

            <path 
              d="M 0 70 Q 80 50, 160 35 T 320 20 T 400 15" 
              fill="none" 
              stroke="#E8E191" 
              strokeWidth="3" 
            />

            <circle cx="400" cy="15" r="4" fill="#2B333F" />
          </svg>

          <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
            <span>Set</span>
          </div>
        </div>
      </div>

      {/* 2. Gráfico Donut (Distribuição dos Temas) */}
      <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-bold text-[#2B333F]">Distribuição dos temas mais acessados</h3>
          <p className="text-[10px] text-slate-400">Baseado nas leituras e revisões dos usuários</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path stroke="#E2E8F0" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke="#E8E191" strokeWidth="4" strokeDasharray="28, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path stroke="#2B333F" strokeWidth="4" strokeDasharray="22, 100" strokeDashoffset="-28" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-black text-[#2B333F] block leading-none">1.248</span>
              <span className="text-[9px] text-slate-400">acessos</span>
            </div>
          </div>

          <div className="space-y-1.5 w-full text-[11px]">
            {temas.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.cor}`} />
                  <span className="text-slate-600 font-medium">{item.nome}</span>
                </div>
                <span className="font-bold text-[#2B333F]">{item.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Atividade Recente */}
      <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#2B333F]">Atividade recente</h3>
          <a href="#" className="text-[10px] font-bold text-[#2B333F] hover:underline">Ver todas →</a>
        </div>

        <div className="space-y-3">
          {atividades.map((item, idx) => {
            const Icone = item.icone;
            return (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="p-1.5 rounded-lg bg-slate-100 text-[#2B333F] shrink-0 mt-0.5">
                  <Icone className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-[#2B333F] truncate">{item.texto}</h4>
                  <p className="text-[10px] text-slate-400">{item.tempo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}