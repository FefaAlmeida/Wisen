CREATE TABLE article_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 0),
  content text NOT NULL, token_count integer NOT NULL CHECK (token_count BETWEEN 1 AND 512),
  model_version text NOT NULL, embedding vector(384) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(article_id, position, model_version)
);
-- Busca exata inicialmente: evita custo de índice ANN sem volume que o justifique.
CREATE INDEX article_chunks_version ON article_chunks(model_version);
CREATE TABLE search_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), query text NOT NULL,
  result_limit integer NOT NULL CHECK (result_limit BETWEEN 1 AND 20),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  results jsonb, error text, model_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
