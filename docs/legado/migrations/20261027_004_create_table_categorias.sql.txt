-- Migration: Criar tabela de categorias
-- Data: 2026-10-27
-- Descrição: Criação da tabela de categorias com campos para nome e descrição.

CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text
);