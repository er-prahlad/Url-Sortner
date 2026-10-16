package com.linkshort.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtil {

    private final JwtProperties props;

    // ── Token generation ────────────────────────────────────────────────────

    public String generateAccessToken(UserDetails user) {
        return buildToken(Map.of("type", "access"), user, props.getAccessTokenExpiry());
    }

    public String generateAccessToken(UserDetails user, Map<String, Object> extraClaims) {
        var claims = new java.util.HashMap<>(extraClaims);
        claims.put("type", "access");
        return buildToken(claims, user, props.getAccessTokenExpiry());
    }

    private String buildToken(Map<String, Object> claims, UserDetails user, long ttlMs) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .claims(claims)
                .subject(user.getUsername())
                .issuedAt(new Date(now))
                .expiration(new Date(now + ttlMs))
                .signWith(signingKey())
                .compact();
    }

    // ── Token validation ────────────────────────────────────────────────────

    public boolean isTokenValid(String token, UserDetails user) {
        try {
            return extractUsername(token).equals(user.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            log.debug("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ── Claims extraction ────────────────────────────────────────────────────

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        byte[] keyBytes = Decoders.BASE64.decode(props.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
