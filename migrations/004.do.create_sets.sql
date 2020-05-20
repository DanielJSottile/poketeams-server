CREATE TABLE sets (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  nickname TEXT,
  species TEXT NOT NULL DEFAULT 'Pikachu',
  gender TEXT,
  item TEXT,
  ability TEXT,
  level INTEGER NOT NULL DEFAULT 100,
  shiny BOOLEAN NOT NULL,
  happiness INTEGER NOT NULL DEFAULT 255,
  nature TEXT,
  hp_ev INTEGER NOT NULL DEFAULT 0,
  atk_ev INTEGER NOT NULL DEFAULT 0,
  def_ev INTEGER NOT NULL DEFAULT 0,
  spa_ev INTEGER NOT NULL DEFAULT 0,
  spd_ev INTEGER NOT NULL DEFAULT 0,
  spe_ev INTEGER NOT NULL DEFAULT 0,
  hp_iv INTEGER NOT NULL DEFAULT 31,
  atk_iv INTEGER NOT NULL DEFAULT 31,
  def_iv INTEGER NOT NULL DEFAULT 31,
  spa_iv INTEGER NOT NULL DEFAULT 31,
  spd_iv INTEGER NOT NULL DEFAULT 31,
  spe_iv INTEGER NOT NULL DEFAULT 31,
  move_one TEXT NOT NULL DEFAULT 'Tackle',
  move_two TEXT,
  move_three TEXT,
  move_four TEXT,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_modified TIMESTAMPTZ
);