-- Migration: Criar tabela de histórico de interações e index de interações por usuário e data
-- Data: 2026-10-27
-- Descrição: Criação da tabela de histórico de interações com campos para ID do usuário, ID do artigo, ID do evento, ID do conceito, ID da resposta à revisão, tipo de evidência, dados da evidência e impacto no nível de domínio.

CREATE TABLE historico_interacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  artigo_id uuid REFERENCES artigos(id) ON DELETE SET NULL,
  evento_id uuid REFERENCES eventos(id) ON DELETE SET NULL,
  conceito_id uuid REFERENCES conceitos(id) ON DELETE SET NULL,
  resposta_revisao_id uuid REFERENCES respostas_revisao(id) ON DELETE SET NULL,
  tipo_evidencia text NOT NULL CHECK (tipo_evidencia IN (
    'VISUALIZACAO_CONCEITO', 'LEITURA', 'CLIQUE_NAO_SEI', 'PEDIDO_EXPLICACAO',
    'ACERTO_REVISAO', 'ERRO_REVISAO')),
  dados_evidencia jsonb,
  impacto_mastery numeric(5,3),
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX historico_usuario_data_idx ON historico_interacoes(usuario_id, criado_em DESC);
CREATE INDEX historico_conceito_idx ON historico_interacoes(conceito_id, criado_em DESC);
