CREATE TABLE feed_progress (
 user_id uuid REFERENCES users ON DELETE CASCADE,
 event_id uuid REFERENCES events ON DELETE CASCADE,
 seconds integer NOT NULL DEFAULT 0 CHECK(seconds>=0),
 dismissed boolean NOT NULL DEFAULT false,
 fingerprint text NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,event_id)
);
CREATE TABLE feed_actions (
 request_id uuid PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE feed_profiles (
 user_id uuid PRIMARY KEY REFERENCES users ON DELETE CASCADE,
 embedding vector(384), model_version text NOT NULL,
 interests text[] NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE feed_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
 filters jsonb NOT NULL, event_ids uuid[] NOT NULL,
 expires_at timestamptz NOT NULL DEFAULT now()+interval '15 minutes'
);
CREATE INDEX feed_sessions_expiry ON feed_sessions(expires_at);
