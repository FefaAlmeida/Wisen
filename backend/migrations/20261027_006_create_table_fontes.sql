-- Migration: Criar tabela de fontes
-- Data: 2026-10-27
-- Descrição: Criação da tabela de fontes com campos para nome, URL do RSS e status.

CREATE TABLE fontes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  url_rss text NOT NULL UNIQUE,
  ativo boolean NOT NULL DEFAULT true,
  ultima_coleta_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now()
);