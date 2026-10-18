CREATE TABLE IF NOT EXISTS click_events (
    id           BIGSERIAL    NOT NULL,
    link_id      BIGINT       NOT NULL,
    clicked_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    ip_address   VARCHAR(45),
    user_agent   VARCHAR(512),
    referer      VARCHAR(2048),
    country      VARCHAR(100),
    country_code VARCHAR(10),
    device_type  VARCHAR(50),
    browser      VARCHAR(100),

    CONSTRAINT pk_click_events PRIMARY KEY (id),
    CONSTRAINT fk_click_events_link FOREIGN KEY (link_id)
        REFERENCES links (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_click_events_link_id    ON click_events (link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_events (clicked_at);
CREATE INDEX IF NOT EXISTS idx_click_events_country    ON click_events (country_code);
CREATE INDEX IF NOT EXISTS idx_click_events_device     ON click_events (device_type);
