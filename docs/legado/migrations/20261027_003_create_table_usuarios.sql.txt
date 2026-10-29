-- Migration: Criar tabela de usuários
-- Data: 2026-10-27
-- Descrição: Criação da tabela de usuários com campos para nome, email, senha, papel, status e timestamps de criação e atualização.

CREATE TABLE usuarios (
  id_usuario uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NULL,
  senha_hash text NOT NULL,
  tipo text NOT NULL DEFAULT 'CLIENTE' CHECK (tipo IN ('CLIENTE', 'ADMIN')),
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX usuarios_email_unico ON usuarios (lower(email));