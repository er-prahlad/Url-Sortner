CREATE TABLE click_events (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    link_id      BIGINT UNSIGNED NOT NULL,
    clicked_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address   VARCHAR(45)     NULL,
    user_agent   VARCHAR(512)    NULL,
    referer      VARCHAR(2048)   NULL,
    country      VARCHAR(100)    NULL,
    country_code VARCHAR(10)     NULL,
    device_type  VARCHAR(50)     NULL,
    browser      VARCHAR(100)    NULL,

    CONSTRAINT pk_click_events PRIMARY KEY (id),
    CONSTRAINT fk_click_events_link FOREIGN KEY (link_id) REFERENCES links (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_click_events_link_id    ON click_events (link_id);
CREATE INDEX idx_click_events_clicked_at ON click_events (clicked_at);
CREATE INDEX idx_click_events_country    ON click_events (country_code);
CREATE INDEX idx_click_events_device     ON click_events (device_type);
