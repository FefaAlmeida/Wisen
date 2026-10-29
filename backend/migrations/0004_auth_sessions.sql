ALTER TABLE search_requests
  ADD COLUMN user_id uuid REFERENCES users ON DELETE CASCADE;

CREATE INDEX search_requests_user_created
  ON search_requests(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

CREATE TABLE auth_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX auth_sessions_expiry ON auth_sessions(expires_at);
