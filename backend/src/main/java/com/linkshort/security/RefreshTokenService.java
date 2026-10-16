package com.linkshort.security;

import com.linkshort.domain.entity.RefreshToken;
import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.RefreshTokenRepository;
import com.linkshort.exception.TokenException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final JwtProperties props;

    @Transactional
    public RefreshToken create(User user) {
        var token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusSeconds(props.getRefreshTokenExpiry() / 1000))
                .build();
        return repository.save(token);
    }

    @Transactional(readOnly = true)
    public RefreshToken findAndValidate(String rawToken) {
        return repository.findByToken(rawToken)
                .filter(RefreshToken::isValid)
                .orElseThrow(() -> new TokenException("Refresh token is invalid or expired"));
    }

    @Transactional
    public void revoke(String rawToken) {
        repository.findByToken(rawToken).ifPresent(t -> {
            t.setRevoked(true);
            repository.save(t);
        });
    }

    @Transactional
    public void revokeAll(Long userId) {
        repository.revokeAllByUserId(userId);
    }

    /** Clean up expired / revoked tokens every day at 02:00 */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanup() {
        repository.deleteExpiredAndRevoked(LocalDateTime.now());
    }
}
