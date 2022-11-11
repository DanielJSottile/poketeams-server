/* USERS */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE users ADD COLUMN user_uuid uuid DEFAULT uuid_generate_v4 ();

/* OTHER */

ALTER TABLE users ADD COLUMN profile_image TEXT;
ALTER TABLE users ADD COLUMN email TEXT;
