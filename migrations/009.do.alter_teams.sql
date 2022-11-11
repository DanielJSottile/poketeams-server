
/* TEAMS */
-- ALTER TABLE teams ADD COLUMN team_uuid uuid DEFAULT uuid_generate_v4 ();
-- ALTER TABLE teams ADD COLUMN folder_uuid uuid REFERENCES folders(folder_uuid) ON DELETE CASCADE NOT NULL;
-- UPDATE teams SET folder_uuid = (SELECT folder_uuid from folders WHERE folders.id = teams.folder_id);
-- ALTER TABLE teams DROP COLUMN IF EXISTS folder_id;
-- ALTER TABLE teams RENAME COLUMN folder_uuid TO folder_id;

ALTER TABLE folders ADD CONSTRAINT folder_unique_id UNIQUE (folder_uuid);

ALTER TABLE teams ADD COLUMN team_uuid uuid NOT NULL UNIQUE DEFAULT uuid_generate_v4 ();
ALTER TABLE teams ADD COLUMN team_folder_uuid uuid REFERENCES folders(folder_uuid) ON DELETE CASCADE;
UPDATE teams SET team_folder_uuid = (SELECT folder_uuid from folders WHERE folders.id = teams.folder_id);
ALTER TABLE teams ALTER COLUMN team_folder_uuid SET NOT NULL;
ALTER TABLE teams DROP COLUMN IF EXISTS folder_id;
ALTER TABLE teams RENAME COLUMN team_folder_uuid TO folder_id;

/* OTHER */

ALTER TABLE teams ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE teams ADD COLUMN team_format TEXT;
