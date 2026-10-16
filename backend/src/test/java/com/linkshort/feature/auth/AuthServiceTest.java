package com.linkshort.feature.auth;

import com.linkshort.domain.entity.RefreshToken;
import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.UserRepository;
import com.linkshort.exception.ConflictException;
import com.linkshort.feature.auth.dto.LoginRequest;
import com.linkshort.feature.auth.dto.RegisterRequest;
import com.linkshort.security.JwtUtil;
import com.linkshort.security.RefreshTokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository        userRepository;
    @Mock JwtUtil               jwtUtil;
    @Mock RefreshTokenService   refreshTokenService;
    @Mock AuthenticationManager authManager;

    @InjectMocks AuthService authService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ── register ─────────────────────────────────────────────────────────────

    @Test
    void registerCreatesUserAndReturnsTokens() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        var saved = builtUser(1L, "alice@example.com");
        when(userRepository.save(any())).thenReturn(saved);
        when(jwtUtil.generateAccessToken(any())).thenReturn("access-tok");
        when(refreshTokenService.create(any())).thenReturn(builtRefreshToken(saved));

        var res = authService.register(
                new RegisterRequest("Alice", "alice@example.com", "Password1"));

        assertThat(res.accessToken()).isEqualTo("access-tok");
        assertThat(res.user().email()).isEqualTo("alice@example.com");
        verify(userRepository).save(argThat(u -> u.getEmail().equals("alice@example.com")));
    }

    @Test
    void registerThrowsConflictForDuplicateEmail() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);
        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("Alice", "alice@example.com", "Password1")))
                .isInstanceOf(ConflictException.class);
        verify(userRepository, never()).save(any());
    }

    // ── login ────────────────────────────────────────────────────────────────

    @Test
    void loginSucceedsWithCorrectCredentials() {
        var user = builtUser(1L, "alice@example.com");
        when(userRepository.findByEmail("alice@example.com")).thenReturn(java.util.Optional.of(user));
        when(jwtUtil.generateAccessToken(any())).thenReturn("access-tok");
        when(refreshTokenService.create(any())).thenReturn(builtRefreshToken(user));
        doNothing().when(refreshTokenService).revokeAll(anyLong());

        var res = authService.login(new LoginRequest("alice@example.com", "Password1"));

        assertThat(res.accessToken()).isEqualTo("access-tok");
        verify(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private User builtUser(Long id, String email) {
        return User.builder().id(id).name("Alice").email(email)
                .passwordHash(encoder.encode("Password1"))
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
    }

    private RefreshToken builtRefreshToken(User user) {
        return RefreshToken.builder()
                .id(1L).user(user).token("refresh-tok")
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
    }
}
