-- Migration: Criar tabela de relações entre conceitos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de relações entre conceitos com campos para IDs dos conceitos, tipo de relação, confiança, etc.

CREATE TABLE conceito_relacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conceito_origem_id uuid NOT NULL REFERENCES conceitos(id) ON DELETE CASCADE,
  conceito_destino_id uuid NOT NULL REFERENCES conceitos(id) ON DELETE CASCADE,
  tipo_relacao text NOT NULL CHECK (tipo_relacao IN ('REQUIRES', 'PART_OF', 'RELATED_TO')),
  confianca numeric(4,3) CHECK (confianca BETWEEN 0 AND 1),
  metodo_criacao text NOT NULL CHECK (metodo_criacao IN ('MANUAL', 'IA')),
  origem_evidencia text,
  status_validacao text NOT NULL DEFAULT 'PENDENTE'
    CHECK (status_validacao IN ('PENDENTE', 'APROVADA', 'REJEITADA')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  validado_em timestamptz,
  validado_por uuid REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE (conceito_origem_id, conceito_destino_id, tipo_relacao),
  CHECK (conceito_origem_id <> conceito_destino_id)
);