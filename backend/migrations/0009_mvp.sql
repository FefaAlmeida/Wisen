ALTER TABLE users ADD COLUMN email_verified_at timestamptz;
ALTER TABLE users ADD COLUMN generation_limit integer CHECK (generation_limit BETWEEN 1 AND 10000);
ALTER TABLE user_preferences ADD COLUMN familiarity text CHECK (familiarity IN ('beginner','basic','experienced'));
ALTER TABLE user_preferences ADD COLUMN knowledge_version integer NOT NULL DEFAULT 0;
ALTER TABLE sources ADD COLUMN attribution text;
ALTER TABLE sources ADD COLUMN internal_reading boolean NOT NULL DEFAULT false;
ALTER TABLE articles ADD COLUMN visible boolean NOT NULL DEFAULT true;
ALTER TABLE articles ADD COLUMN curated boolean NOT NULL DEFAULT false;
ALTER TABLE events ADD COLUMN curated boolean NOT NULL DEFAULT false;
ALTER TABLE concepts ADD COLUMN curated boolean NOT NULL DEFAULT false;
ALTER TABLE events ADD COLUMN topics text[] NOT NULL DEFAULT '{}';
ALTER TABLE events ADD COLUMN version integer NOT NULL DEFAULT 1;
CREATE TABLE account_tokens (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
 token_hash text NOT NULL UNIQUE, purpose text NOT NULL CHECK(purpose IN ('verify','reset')),
 email text NOT NULL, expires_at timestamptz NOT NULL, used_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE mail_outbox (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users ON DELETE CASCADE,
 recipient text NOT NULL, subject text NOT NULL, body text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','sending','sent','failed')),
 attempts integer NOT NULL DEFAULT 0, provider_id text, last_error text, created_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz
);
CREATE TABLE budget_months (
 month date PRIMARY KEY, limit_brl numeric(14,8) NOT NULL CHECK(limit_brl>=0),
 committed_brl numeric(14,8) NOT NULL DEFAULT 0 CHECK(committed_brl>=0)
);
CREATE TABLE generation_tasks (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users ON DELETE CASCADE,
 article_id uuid REFERENCES articles ON DELETE CASCADE, event_id uuid REFERENCES events ON DELETE CASCADE,
 concept_id uuid REFERENCES concepts ON DELETE CASCADE, review_id uuid REFERENCES reviews ON DELETE CASCADE,
 operation text NOT NULL CHECK(operation IN ('analysis','explanation','concept','passage','deepen','questions','grade')),
 cache_key text NOT NULL, input jsonb NOT NULL, result jsonb,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','failed','paused')),
 error text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX generation_cache ON generation_tasks(cache_key) WHERE status IN ('pending','processing','completed','paused');
CREATE TABLE generation_charges (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), task_id uuid REFERENCES generation_tasks ON DELETE SET NULL,
 month date NOT NULL REFERENCES budget_months, user_id uuid REFERENCES users ON DELETE SET NULL,
 model text NOT NULL, reserved_brl numeric(14,8) NOT NULL CHECK(reserved_brl>=0), actual_brl numeric(14,8),
 input_rate numeric NOT NULL, output_rate numeric NOT NULL, fx numeric NOT NULL, margin numeric NOT NULL,
 input_tokens integer, output_tokens integer, latency_ms integer,
 status text NOT NULL DEFAULT 'reserved' CHECK(status IN ('reserved','completed','unknown','released')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX generation_charges_user_day ON generation_charges(user_id,created_at);
CREATE TABLE article_analyses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), article_id uuid NOT NULL REFERENCES articles ON DELETE CASCADE,
 task_id uuid UNIQUE REFERENCES generation_tasks ON DELETE SET NULL, model text NOT NULL, prompt_version text NOT NULL,
 data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE question_bank (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
 prompt text NOT NULL, options jsonb NOT NULL, correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3),
 explanation text NOT NULL, rubric text NOT NULL, version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(concept_id,prompt)
);
ALTER TABLE reviews ADD COLUMN question_id uuid REFERENCES question_bank ON DELETE SET NULL;
CREATE UNIQUE INDEX review_one_pending ON reviews(user_id,concept_id) WHERE completed_at IS NULL;
ALTER TABLE review_attempts ADD COLUMN request_id uuid UNIQUE;
ALTER TABLE user_interactions ADD COLUMN request_id uuid UNIQUE;
CREATE TABLE admin_audit (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid REFERENCES users ON DELETE SET NULL,
 action text NOT NULL, target_id uuid, before_data jsonb, after_data jsonb, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE explanation_feedback (
 user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE, task_id uuid NOT NULL REFERENCES generation_tasks ON DELETE CASCADE,
 useful boolean NOT NULL, clear boolean NOT NULL, unnecessary boolean NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,task_id)
);
UPDATE sources SET attribution='Agência Brasil / EBC',internal_reading=true WHERE slug='agencia-brasil-economia';
ALTER TABLE user_concepts DROP CONSTRAINT user_concepts_status_check;
ALTER TABLE user_concepts ADD CONSTRAINT user_concepts_status_check CHECK(status IN ('unassessed','gap','review','mastered'));
ALTER TABLE user_concepts ALTER COLUMN status SET DEFAULT 'unassessed';
