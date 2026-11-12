import { Eye, Layout } from "lucide-react";
import React from "react";
import { Footer } from "@/components/footer";

export default function PaginaDemonstracao() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans text-[#2B333F] selection:bg-[#E8E191]">
      {/* Área Principal de Teste / Demonstração */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8">
        {/* Banner de Teste */}
        <div className="bg-[#2B333F] text-white p-8 rounded-3xl space-y-4 shadow-md relative overflow-hidden">
          <div className="flex items-center gap-2 text-[#E8E191]">
            <Eye className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Modo de Visualização</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">
            Demonstração do Rodapé (`Footer`)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
            Esta página serve para testar visualmente a estrutura, os links, a responsividade e as
            cores do componente{" "}
            <code className="text-[#E8E191] bg-slate-800 px-1.5 py-0.5 rounded">footer.jsx</code>.
          </p>
        </div>

        {/* Blocos de Conteúdo para Gerar Altura de Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <Layout className="w-5 h-5 text-[#2B333F]" />
            <h3 className="font-bold text-sm">Design Isolado</h3>
            <p className="text-xs text-slate-500">
              O rodapé foi desenvolvido de forma independente para ser acoplado facilmente em
              qualquer rota.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-3 h-3 rounded-full bg-[#E8E191]" />
            <h3 className="font-bold text-sm">Paleta Oficial</h3>
            <p className="text-xs text-slate-500">
              Usa o tom Escuro (<code className="text-[11px]">#2B333F</code>) no fundo e o Amarelo (
              <code className="text-[11px]">#E8E191</code>) nos destaques.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              100%
            </span>
            <h3 className="font-bold text-sm">Responsivo</h3>
            <p className="text-xs text-slate-500">
              Ajusta-se automaticamente de 1 coluna em telas móveis para 5 colunas em monitores
              desktop.
            </p>
          </div>
        </div>

        {/* Espaçamento Simulado */}
        <div className="p-8 border border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-400">
          Role a página para baixo para visualizar o rodapé fixado ao fundo.
        </div>
      </main>

      {/* Componente Rodapé em Teste */}
    </div>
  );
}
