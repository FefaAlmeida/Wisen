-- Migration: Criar tabela de respostas às revisões e index de respostas por usuário e data de resposta
-- Data: 2026-10-27
-- Descrição: Criação da tabela de respostas às revisões com campos para ID da revisão, ID do usuário, resposta do usuário, indicador de acerto e métricas de dificuldade.

CREATE TABLE respostas_revisao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revisao_id uuid NOT NULL REFERENCES revisoes(id) ON DELETE RESTRICT,
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  resposta_usuario jsonb,
  acertou boolean,
  dificuldade_percebida text CHECK (dificuldade_percebida IN ('FACIL', 'MEDIO', 'DIFICIL', 'ERREI')),
  mastery_antes numeric(4,3) CHECK (mastery_antes BETWEEN 0 AND 1),
  mastery_depois numeric(4,3) CHECK (mastery_depois BETWEEN 0 AND 1),
  respondido_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX respostas_usuario_data_idx ON respostas_revisao(usuario_id, respondido_em DESC);