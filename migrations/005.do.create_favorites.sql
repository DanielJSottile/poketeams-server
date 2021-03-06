CREATE TABLE favorites (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_modified TIMESTAMPTZ
);