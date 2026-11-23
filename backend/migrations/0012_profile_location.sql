CREATE TABLE countries (
  code text PRIMARY KEY CHECK (code ~ '^[A-Z]{2}$'),
  name text NOT NULL
);

CREATE TABLE states (
  id integer PRIMARY KEY,
  country_code text NOT NULL REFERENCES countries(code),
  code text,
  name text NOT NULL,
  UNIQUE (country_code, id)
);

ALTER TABLE users
  ADD COLUMN country_code text REFERENCES countries(code),
  ADD COLUMN state_id integer,
  ADD CONSTRAINT users_state_country_fk FOREIGN KEY (country_code, state_id)
    REFERENCES states(country_code, id),
  ADD CONSTRAINT users_state_requires_country CHECK (state_id IS NULL OR country_code IS NOT NULL);
