-- Migration: Criar tabela de evento_categorias
-- Data: 2026-10-27
-- Descrição: Criação da tabela de evento_categorias com campos para ID do evento e ID da categoria.

CREATE TABLE evento_categorias (
  evento_id uuid NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  categoria_id uuid NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (evento_id, categoria_id)
);