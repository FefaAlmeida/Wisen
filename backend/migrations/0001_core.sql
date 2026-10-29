CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  password_hash text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_unique ON users (lower(email));
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE,
  interests text[] NOT NULL DEFAULT '{}',
  locale text NOT NULL DEFAULT 'pt-BR',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  feed_url text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  last_collected_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  started_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'pending_enrichment', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES sources,
  url text NOT NULL UNIQUE,
  title text NOT NULL,
  content text,
  content_hash text,
  published_at timestamptz,
  processing_status text NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'processed', 'pending_enrichment', 'failed')),
  embedding_version text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX articles_publication ON articles (published_at DESC, id);
CREATE TABLE event_articles (
  article_id uuid PRIMARY KEY REFERENCES articles ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX event_articles_event ON event_articles(event_id);
CREATE TABLE concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
  description text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX concepts_name_unique ON concepts(lower(name));
CREATE TABLE concept_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE, alias text NOT NULL
);
CREATE UNIQUE INDEX concept_aliases_unique ON concept_aliases(lower(alias));
CREATE TABLE entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
  type text NOT NULL, description text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(name, type)
);

-- Cada associação automática possui evidência identificável. source_id é o id
-- da evidência (artigo, evento ou análise), qualificado por source_type.
CREATE TABLE article_concepts (
  article_id uuid NOT NULL REFERENCES articles ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(article_id, concept_id)
);
CREATE TABLE article_entities (
  article_id uuid NOT NULL REFERENCES articles ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES entities ON DELETE CASCADE,
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(article_id, entity_id)
);
CREATE TABLE event_concepts (
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(event_id, concept_id)
);
CREATE TABLE event_entities (
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  entity_id uuid NOT NULL REFERENCES entities ON DELETE CASCADE,
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(event_id, entity_id)
);
CREATE TABLE concept_relations (
  from_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  to_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  relation text NOT NULL CHECK (relation IN ('RELATED_TO', 'REQUIRES', 'PART_OF')),
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(from_id, to_id, relation), CHECK (from_id <> to_id)
);
CREATE TABLE event_relations (
  from_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  to_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  relation text NOT NULL,
  source_type text NOT NULL, source_id uuid NOT NULL, method text NOT NULL,
  model text, confidence real NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(from_id, to_id, relation), CHECK (from_id <> to_id)
);
CREATE TABLE user_concepts (
  user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  mastery_score real NOT NULL DEFAULT 0 CHECK (mastery_score BETWEEN 0 AND 1),
  status text NOT NULL DEFAULT 'gap' CHECK (status IN ('gap', 'review', 'mastered')),
  last_exposure timestamptz, last_review timestamptz, next_review timestamptz,
  successful_reviews integer NOT NULL DEFAULT 0 CHECK (successful_reviews >= 0),
  failed_reviews integer NOT NULL DEFAULT 0 CHECK (failed_reviews >= 0),
  PRIMARY KEY(user_id, concept_id)
);
CREATE INDEX user_concepts_next_review ON user_concepts(user_id, next_review);
CREATE TABLE user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  concept_id uuid REFERENCES concepts, article_id uuid REFERENCES articles, event_id uuid REFERENCES events,
  type text NOT NULL, evidence jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_interactions_history ON user_interactions(user_id, created_at DESC);
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
  due_at timestamptz NOT NULL, completed_at timestamptz,
  format text NOT NULL CHECK (format IN ('recall', 'recognition', 'explanation')),
  question jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE review_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), review_id uuid NOT NULL REFERENCES reviews ON DELETE CASCADE,
  answer jsonb NOT NULL, correct boolean, feedback text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE saved_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  article_id uuid REFERENCES articles ON DELETE CASCADE,
  event_id uuid REFERENCES events ON DELETE CASCADE,
  concept_id uuid REFERENCES concepts ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(article_id, event_id, concept_id) = 1),
  UNIQUE(user_id, article_id), UNIQUE(user_id, event_id), UNIQUE(user_id, concept_id)
);
CREATE TABLE ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), article_id uuid REFERENCES articles ON DELETE SET NULL,
  provider text NOT NULL, model text NOT NULL, operation text NOT NULL,
  input_tokens integer CHECK (input_tokens >= 0), output_tokens integer CHECK (output_tokens >= 0),
  estimated_cost numeric(12,6) NOT NULL DEFAULT 0 CHECK (estimated_cost >= 0),
  currency text NOT NULL DEFAULT 'BRL', latency_ms integer CHECK (latency_ms >= 0),
  status text NOT NULL CHECK (status IN ('completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
