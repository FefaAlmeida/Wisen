-- Migration: Criar extensões necessárias para o banco de dados
-- Data: 2026-10-27
-- Descrição: Executar em um banco PostgreSQL com extensão pgvector disponível.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
