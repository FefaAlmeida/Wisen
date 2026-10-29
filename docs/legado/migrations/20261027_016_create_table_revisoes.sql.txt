-- Migration: Criar tabela de revisões e index de revisões por usuário e data de revisão
-- Data: 2026-10-27
-- Descrição: Criação da tabela de revisões com campos para ID do conceito, tipo de revisão, enunciado, conteúdo da resposta, indicador de geração por IA e timestamp de criação. Além disso, criação de índice para otimizar consultas por usuário e data da próxima revisão.

CREATE INDEX dominio_revisao_idx ON usuario_conceito_dominio(usuario_id, proxima_revisao_em);
CREATE TABLE revisoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conceito_id uuid NOT NULL REFERENCES conceitos(id) ON DELETE CASCADE,
  tipo text NOT NULL CHECK (tipo IN ('QUIZ', 'FLASHCARD')),
  enunciado text NOT NULL,
  conteudo_resposta jsonb, -- gabarito ou dados de flashcard; não enviar ao cliente antecipadamente
  gerado_por_ia boolean NOT NULL DEFAULT false,
  criado_em timestamptz NOT NULL DEFAULT now()
);