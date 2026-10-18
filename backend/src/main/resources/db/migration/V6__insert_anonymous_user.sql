-- System user for anonymous (unauthenticated) link shortening.
-- Password hash is a BCrypt hash of a randomly generated value that is
-- never exposed and cannot be used to log in.
INSERT INTO users (name, email, password_hash, role, enabled)
VALUES (
    'Anonymous',
    'anonymous@system.internal',
    '$2a$12$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'USER',
    0          -- disabled = cannot log in
)
ON DUPLICATE KEY UPDATE id = id;  -- no-op if already exists
