-- Migration: Criar tabela de logs de coleta e index de coletas por fonte e data
-- Data: 2026-10-27
-- Descrição: Criação da tabela de logs de coleta com campos para fonte, status, artigos encontrados, detalhes do erro, e timestamps de início e finalização. 

CREATE TABLE logs_coleta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fonte_id uuid NOT NULL REFERENCES fontes(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('SUCESSO', 'ERRO')),
  artigos_encontrados integer CHECK (artigos_encontrados >= 0),
  detalhes_erro text,
  iniciado_em timestamptz NOT NULL DEFAULT now(),
  finalizado_em timestamptz
);