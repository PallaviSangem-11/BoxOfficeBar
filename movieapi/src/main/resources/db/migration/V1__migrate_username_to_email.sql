-- First, disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Add the email column
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Update existing users to use their username as email (temporary)
UPDATE users SET email = username;

-- Make email column not null and unique
ALTER TABLE users MODIFY email VARCHAR(255) NOT NULL;
ALTER TABLE users ADD UNIQUE (email);

-- Drop the username column
ALTER TABLE users DROP COLUMN username;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1; 