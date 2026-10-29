-- Migration: Criar tabela de logs de execução da IA e index de execuções por usuário e data
-- Data: 2026-10-27
-- Descrição: Criação da tabela de logs de execução da IA com campos para operacao, modelo, provedor, execução local, tokens de entrada e saída, latência, custo, status e timestamp de criação. Além disso, criação de index sobre os logs da IA.

CREATE TABLE logs_execucao_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operacao text NOT NULL,
  modelo text NOT NULL,
  provedor text NOT NULL,
  execucao_local boolean NOT NULL DEFAULT false,
  tokens_entrada integer CHECK (tokens_entrada >= 0),
  tokens_saida integer CHECK (tokens_saida >= 0),
  latencia_ms integer CHECK (latencia_ms >= 0),
  custo_brl numeric(12,6) NOT NULL DEFAULT 0 CHECK (custo_brl >= 0),
  status text NOT NULL CHECK (status IN ('SUCESSO', 'ERRO')),
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX logs_ia_data_idx ON logs_execucao_ia(criado_em DESC);