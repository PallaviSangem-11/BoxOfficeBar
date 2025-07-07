-- Drop the existing users table
DROP TABLE IF EXISTS users;

-- Create the new users table with email
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Insert the admin user with email
INSERT INTO users (email, password, role, is_active) 
VALUES ('admin@movieapp.com', '$2a$10$rDkPvvAFV6GgJjXpYWxqUOQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ', 'ADMIN', true); 