

/* TEAMS */
ALTER TABLE teams RENAME COLUMN is_public TO is_private;

/* SETS */
ALTER TABLE sets ADD COLUMN set_uuid uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4 ();
ALTER TABLE sets ADD COLUMN set_team_uuid uuid REFERENCES teams(team_uuid) ON DELETE CASCADE;
UPDATE sets SET set_team_uuid = (SELECT team_uuid from teams WHERE teams.id = sets.team_id);
ALTER TABLE sets ALTER COLUMN set_team_uuid SET NOT NULL;
ALTER TABLE sets DROP COLUMN IF EXISTS team_id;
ALTER TABLE sets RENAME COLUMN set_team_uuid TO team_id;

/* CLEAN UP SETS */
ALTER TABLE sets DROP CONSTRAINT sets_pkey;
ALTER TABLE sets DROP COLUMN IF EXISTS id;
ALTER TABLE sets RENAME COLUMN set_uuid TO id;
ALTER TABLE sets ADD PRIMARY KEY (id);

/* OTHER */

ALTER TABLE sets ADD COLUMN tera_type TEXT NOT NULL DEFAULT 'Normal';
ALTER TABLE sets ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT FALSE;
