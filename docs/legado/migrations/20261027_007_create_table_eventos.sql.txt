-- Migration: Criar tabela de eventos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de eventos com campos para título, resumo, data de ocorrência e status.

CREATE TABLE eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  resumo_geral text,
  ocorrido_em timestamptz,
  status text NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'ARQUIVADO', 'MESCLADO')),
  embedding vector(384), -- ajustar caso o modelo de embeddings tenha outra dimensão
  embedding_modelo text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);