ALTER TABLE IF EXISTS data_users ADD CONSTRAINT user_email_unique UNIQUE (email);
