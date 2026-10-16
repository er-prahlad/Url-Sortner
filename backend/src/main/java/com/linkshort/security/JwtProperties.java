package com.linkshort.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter @Setter
public class JwtProperties {
    /** Base64-encoded 256-bit secret key */
    private String secret;
    /** Access token TTL in milliseconds (default 15 min) */
    private long accessTokenExpiry = 900_000L;
    /** Refresh token TTL in milliseconds (default 7 days) */
    private long refreshTokenExpiry = 604_800_000L;
}
