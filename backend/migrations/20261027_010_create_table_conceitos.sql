-- Migration: Criar tabela de conceitos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de conceitos com campos para nome, descrição e embeddings.

CREATE TABLE conceitos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  embedding vector(384),
  embedding_modelo text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);