/* CLEAN UP TEAMS */
ALTER TABLE teams DROP CONSTRAINT teams_pkey;
ALTER TABLE teams DROP COLUMN IF EXISTS id;
ALTER TABLE teams RENAME COLUMN team_uuid TO id;
ALTER TABLE teams ADD PRIMARY KEY (id);
