-- Migration: Criar tabela de sugestões do grafo
-- Data: 2026-10-27
-- Descrição: Criação da tabela de sugestões do grafo com campos para tipo de alvo, dados propostos, confiança, origem da evidência e status.

CREATE TABLE sugestoes_grafo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_alvo text NOT NULL CHECK (tipo_alvo IN ('CONCEITO_RELACAO', 'EVENTO_CONCEITO', 'EVENTO_ENTIDADE')),
  dados_propostos jsonb NOT NULL,
  confianca numeric(4,3) CHECK (confianca BETWEEN 0 AND 1),
  origem_evidencia text,
  status text NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADA', 'REJEITADA')),
  revisado_por uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  revisado_em timestamptz
);