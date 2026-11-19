CREATE TABLE review_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users ON DELETE CASCADE,
 request_id uuid NOT NULL, format text NOT NULL CHECK(format IN ('quiz','flashcards')),
 created_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz,
 difficulty text CHECK(difficulty IN ('Fácil','Médio','Difícil')), UNIQUE(user_id,request_id)
);
CREATE INDEX review_sessions_user ON review_sessions(user_id,created_at DESC);
CREATE TABLE review_session_items (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES review_sessions ON DELETE CASCADE,
 question_id uuid REFERENCES question_bank ON DELETE SET NULL, concept_id uuid NOT NULL REFERENCES concepts ON DELETE CASCADE,
 position integer NOT NULL, snapshot jsonb NOT NULL, answer integer CHECK(answer BETWEEN 0 AND 3),
 correct boolean, completed_at timestamptz, UNIQUE(session_id,position)
);
CREATE INDEX review_session_items_question ON review_session_items(question_id,completed_at);
CREATE TABLE editorial_imports (key text PRIMARY KEY, imported_at timestamptz NOT NULL DEFAULT now());
