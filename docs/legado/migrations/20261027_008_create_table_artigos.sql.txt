-- Migration: Criar tabela de artigos
-- Data: 2026-10-27
-- Descrição: Criação da tabela de artigos com campos para fonte, evento, título, URL original e conteúdo.

CREATE TABLE artigos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte_id uuid NOT NULL REFERENCES fontes(id) ON DELETE RESTRICT,
  evento_id uuid REFERENCES eventos(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  url_original text NOT NULL UNIQUE,
  conteudo_texto text,
  hash_conteudo text,
  publicado_em timestamptz,
  coletado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  status_processamento text NOT NULL DEFAULT 'PENDENTE'
    CHECK (status_processamento IN ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO')),
  embedding vector(384),
  embedding_modelo text,
  CONSTRAINT artigo_concluido_tem_evento CHECK (status_processamento <> 'CONCLUIDO' OR evento_id IS NOT NULL)
);
CREATE INDEX artigos_evento_idx ON artigos(evento_id);
CREATE INDEX artigos_fonte_publicado_idx ON artigos(fonte_id, publicado_em DESC);
CREATE INDEX artigos_hash_idx ON artigos(hash_conteudo);
CREATE TABLE evento_relacoes (
  evento_origem_id uuid NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  evento_destino_id uuid NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  tipo_relacao text NOT NULL CHECK (tipo_relacao IN ('DESDOBRAMENTO', 'RELACIONADO', 'ANTECEDENTE')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (evento_origem_id, evento_destino_id, tipo_relacao),
  CHECK (evento_origem_id <> evento_destino_id)
);