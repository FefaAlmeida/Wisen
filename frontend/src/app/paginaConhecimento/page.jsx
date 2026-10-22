import React from 'react';
import { CabecalhoConhecimento } from '@/components/meuConhecimento/cabecalhoConhecimento';
import { CartoesEstatisticas } from '@/components/meuConhecimento/cartoesEstatisticas';
import { GraficoEvolucao } from '@/components/meuConhecimento/graficoEvolucao';
import { HistoricoAtividades } from '@/components/meuConhecimento/historicoAtividades';
import { DistribuicaoCategorias } from '@/components/meuConhecimento/distribuicaoCategorias';
import { CartaoFocoAtual } from '@/components/meuConhecimento/cartaoFocoAtual';

export default function PaginaConhecimento() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 space-y-8 bg-slate-50/60 min-h-screen">
      {/* Cabeçalho */}
      <CabecalhoConhecimento />

      {/* Linha 1: 3 Cartões de Estatísticas Superiores */}
      <CartoesEstatisticas />

      {/* Linha 2: Área Principal de Conteúdo (2 Colunas: 2/3 e 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico de Evolução */}
          <GraficoEvolucao />

          {/* Histórico Recente de Atividades */}
          <HistoricoAtividades />
        </div>

        {/* Coluna Lateral (1/3) */}
        <div className="space-y-6">
          {/* Distribuição por Categoria */}
          <DistribuicaoCategorias />

          {/* Seu Foco Atual e Incentive Box */}
          <CartaoFocoAtual />
        </div>
      </div>
    </div>
  );
}