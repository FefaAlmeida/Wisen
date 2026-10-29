-- Migration: Criar tabela de entidades
-- Data: 2026-10-27
-- Descrição: Criação da tabela de entidades com campos para nome, tipo e descrição.

CREATE TABLE entidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('PESSOA', 'ORGANIZACAO', 'LOCAL', 'OUTRO')),
  descricao text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (nome, tipo)
);