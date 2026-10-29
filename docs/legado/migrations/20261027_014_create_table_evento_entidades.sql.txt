-- Migration: Criar tabela de quais entidades estão relacionadas a quais eventos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de relações entre entidades e eventos com campos para ID do evento, ID da entidade, tipo de relação, confiança, método de criação, origem da evidência e status de validação.

CREATE TABLE evento_entidades (
  evento_id uuid NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  entidade_id uuid NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  tipo_relacao text NOT NULL DEFAULT 'INVOLVES' CHECK (tipo_relacao IN ('INVOLVES', 'MENTIONS')),
  confianca numeric(4,3) CHECK (confianca BETWEEN 0 AND 1),
  metodo_criacao text NOT NULL DEFAULT 'IA' CHECK (metodo_criacao IN ('MANUAL', 'IA')),
  origem_evidencia text,
  status_validacao text NOT NULL DEFAULT 'PENDENTE'
    CHECK (status_validacao IN ('PENDENTE', 'APROVADA', 'REJEITADA')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (evento_id, entidade_id)
);