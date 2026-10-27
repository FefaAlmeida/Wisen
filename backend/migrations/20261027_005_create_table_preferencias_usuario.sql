-- Migration: Criar tabela de preferências do usuário
-- Data: 2026-10-27
-- Descrição: Criação da tabela de preferências do usuário com campos para ID do usuário, ID da categoria e peso de interesse.

CREATE TABLE preferencias_usuario (
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id uuid NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  peso_interesse numeric(4,3) NOT NULL DEFAULT 0.5 CHECK (peso_interesse BETWEEN 0 AND 1),
  PRIMARY KEY (usuario_id, categoria_id)
);