-- Conceitos do rascunho anterior preservados na modelagem consolidada.
ALTER TABLE users ADD COLUMN phone text;
ALTER TABLE users ADD COLUMN active boolean NOT NULL DEFAULT true;
ALTER TABLE users ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE events ADD COLUMN lifecycle_status text NOT NULL DEFAULT 'active' CHECK (lifecycle_status IN ('active','archived','merged'));
ALTER TABLE events ADD COLUMN embedding vector(384);
ALTER TABLE events ADD COLUMN embedding_version text;
ALTER TABLE concepts ADD COLUMN embedding vector(384);
ALTER TABLE concepts ADD COLUMN embedding_version text;
ALTER TABLE user_concepts ADD COLUMN review_interval_days numeric(10,2) CHECK (review_interval_days >= 0);
ALTER TABLE user_concepts ADD COLUMN memory_stability numeric(12,4) CHECK (memory_stability >= 0);
ALTER TABLE user_concepts ADD COLUMN memory_difficulty numeric(8,4);
ALTER TABLE review_attempts ADD COLUMN mastery_before real CHECK (mastery_before BETWEEN 0 AND 1);
ALTER TABLE review_attempts ADD COLUMN mastery_after real CHECK (mastery_after BETWEEN 0 AND 1);
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL UNIQUE, description text
);
CREATE TABLE user_category_interests (
  user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories ON DELETE CASCADE,
  interest_weight real NOT NULL DEFAULT 0.5 CHECK (interest_weight BETWEEN 0 AND 1),
  PRIMARY KEY(user_id, category_id)
);
CREATE TABLE event_categories (
  event_id uuid NOT NULL REFERENCES events ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories ON DELETE CASCADE,
  PRIMARY KEY(event_id, category_id)
);
CREATE TABLE collection_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_id uuid NOT NULL REFERENCES sources ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('completed','failed')), articles_found integer CHECK (articles_found >= 0),
  error text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE graph_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), target_type text NOT NULL,
  proposed_data jsonb NOT NULL, confidence real CHECK (confidence BETWEEN 0 AND 1),
  source_type text NOT NULL, source_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by uuid REFERENCES users ON DELETE SET NULL,
  reviewed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
