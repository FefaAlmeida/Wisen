-- Migration: Criar tabela de quais conceitos estão relacionados a quais eventos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de relações entre conceitos e eventos com campos para ID do evento, ID do conceito, tipo de relação, confiança, método de criação, origem da evidência e status de validação.

CREATE TABLE evento_conceitos (
  evento_id uuid NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  conceito_id uuid NOT NULL REFERENCES conceitos(id) ON DELETE CASCADE,
  tipo_relacao text NOT NULL DEFAULT 'REQUIRES' CHECK (tipo_relacao IN ('REQUIRES', 'MENTIONS')),
  confianca numeric(4,3) CHECK (confianca BETWEEN 0 AND 1),
  metodo_criacao text NOT NULL DEFAULT 'IA' CHECK (metodo_criacao IN ('MANUAL', 'IA')),
  origem_evidencia text,
  status_validacao text NOT NULL DEFAULT 'PENDENTE'
    CHECK (status_validacao IN ('PENDENTE', 'APROVADA', 'REJEITADA')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (evento_id, conceito_id)
);