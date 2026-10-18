CREATE TABLE IF NOT EXISTS links (
    id            BIGINT          NOT NULL AUTO_INCREMENT,
    user_id       BIGINT          NOT NULL,
    original_url  TEXT            NOT NULL,
    short_code    VARCHAR(30)     NOT NULL,
    custom_alias  VARCHAR(30)     NULL,
    title         VARCHAR(200)    NULL,
    password_hash VARCHAR(255)    NULL,
    status        ENUM('ACTIVE','DISABLED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    clicks        BIGINT          NOT NULL DEFAULT 0,
    expires_at    DATETIME        NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_links          PRIMARY KEY (id),
    CONSTRAINT uq_links_short_code UNIQUE (short_code),
    CONSTRAINT fk_links_user     FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_links_user_id    ON links (user_id);
CREATE INDEX idx_links_short_code ON links (short_code);
CREATE INDEX idx_links_status     ON links (status);
CREATE INDEX idx_links_expires_at ON links (expires_at);
