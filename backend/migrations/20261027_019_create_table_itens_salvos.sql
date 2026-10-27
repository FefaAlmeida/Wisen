-- Migration: Criar tabela de itens salvos e índices de salvamento por usuário e tipo de item
-- Data: 2026-10-27
-- Descrição: Criação da tabela de itens salvos com campos para ID do usuário, ID do artigo, ID do evento, ID do conceito e timestamp de salvamento.

CREATE TABLE itens_salvos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id uuid REFERENCES eventos(id) ON DELETE CASCADE,
  artigo_id uuid REFERENCES artigos(id) ON DELETE CASCADE,
  conceito_id uuid REFERENCES conceitos(id) ON DELETE CASCADE,
  salvo_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT somente_um_tipo_salvo CHECK (
    (CASE WHEN evento_id IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN artigo_id IS NULL THEN 0 ELSE 1 END) +
    (CASE WHEN conceito_id IS NULL THEN 0 ELSE 1 END) = 1
  )
);
CREATE UNIQUE INDEX itens_salvos_evento_unico ON itens_salvos(usuario_id, evento_id) WHERE evento_id IS NOT NULL;
CREATE UNIQUE INDEX itens_salvos_artigo_unico ON itens_salvos(usuario_id, artigo_id) WHERE artigo_id IS NOT NULL;
CREATE UNIQUE INDEX itens_salvos_conceito_unico ON itens_salvos(usuario_id, conceito_id) WHERE conceito_id IS NOT NULL;
