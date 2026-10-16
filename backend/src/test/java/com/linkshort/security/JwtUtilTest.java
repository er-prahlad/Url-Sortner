package com.linkshort.security;

import com.linkshort.domain.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        var props = new JwtProperties();
        // 32-byte base64 key (valid for HMAC-SHA256)
        props.setSecret("dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLW9ubHkAAAAAAAAAAAAA");
        props.setAccessTokenExpiry(900_000L);
        props.setRefreshTokenExpiry(604_800_000L);
        jwtUtil = new JwtUtil(props);
    }

    private User makeUser(String email) {
        return User.builder()
                .id(1L).name("Test User").email(email)
                .passwordHash("hash").build();
    }

    @Test
    void generateAndValidateToken() {
        User user  = makeUser("alice@example.com");
        String tok = jwtUtil.generateAccessToken(user);

        assertThat(tok).isNotBlank();
        assertThat(jwtUtil.extractUsername(tok)).isEqualTo("alice@example.com");
        assertThat(jwtUtil.isTokenValid(tok, user)).isTrue();
        assertThat(jwtUtil.isTokenExpired(tok)).isFalse();
    }

    @Test
    void tokenIsInvalidForDifferentUser() {
        User alice = makeUser("alice@example.com");
        User bob   = makeUser("bob@example.com");
        String tok = jwtUtil.generateAccessToken(alice);

        assertThat(jwtUtil.isTokenValid(tok, bob)).isFalse();
    }

    @Test
    void expiredTokenIsDetected() {
        var props = new JwtProperties();
        props.setSecret("dGVzdC1zZWNyZXQta2V5LWZvci11bml0LXRlc3RzLW9ubHkAAAAAAAAAAAAA");
        props.setAccessTokenExpiry(-1L);   // already expired
        props.setRefreshTokenExpiry(604_800_000L);
        var expiredJwtUtil = new JwtUtil(props);

        User user  = makeUser("alice@example.com");
        String tok = expiredJwtUtil.generateAccessToken(user);

        assertThat(expiredJwtUtil.isTokenExpired(tok)).isTrue();
    }
}
