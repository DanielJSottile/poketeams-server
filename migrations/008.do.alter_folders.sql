ALTER TABLE users ADD CONSTRAINT user_unique_id UNIQUE (user_uuid);
ALTER TABLE users ALTER COLUMN user_uuid SET NOT NULL;

/* FOLDERS */
ALTER TABLE folders ADD COLUMN folder_uuid uuid NOT NULL DEFAULT uuid_generate_v4 ();
ALTER TABLE folders ADD COLUMN folder_user_uuid uuid REFERENCES users(user_uuid) ON DELETE CASCADE;
UPDATE folders SET folder_user_uuid = (SELECT user_uuid from users WHERE users.id = folders.user_id);
ALTER TABLE folders ALTER COLUMN folder_user_uuid SET NOT NULL;
ALTER TABLE folders DROP COLUMN IF EXISTS user_id;
ALTER TABLE folders RENAME COLUMN folder_user_uuid TO user_id;
