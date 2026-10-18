CREATE TABLE IF NOT EXISTS links (
    id            BIGSERIAL       NOT NULL,
    user_id       BIGINT          NOT NULL,
    original_url  TEXT            NOT NULL,
    short_code    VARCHAR(30)     NOT NULL,
    custom_alias  VARCHAR(30),
    title         VARCHAR(200),
    password_hash VARCHAR(255),
    status        VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE'
                      CHECK (status IN ('ACTIVE', 'DISABLED', 'EXPIRED')),
    clicks        BIGINT          NOT NULL DEFAULT 0,
    expires_at    TIMESTAMP,
    created_at    TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_links PRIMARY KEY (id),
    CONSTRAINT uq_links_short_code UNIQUE (short_code),
    CONSTRAINT fk_links_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_links_user_id    ON links (user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links (short_code);
CREATE INDEX IF NOT EXISTS idx_links_status     ON links (status);
CREATE INDEX IF NOT EXISTS idx_links_expires_at ON links (expires_at);
