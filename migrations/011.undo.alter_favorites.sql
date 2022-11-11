CREATE TABLE favorites (
  id uuid DEFAULT uuid_generate_v4 ();
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_modified TIMESTAMPTZ
);
