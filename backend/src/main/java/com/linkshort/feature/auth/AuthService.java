package com.linkshort.feature.auth;

import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.UserRepository;
import com.linkshort.exception.ConflictException;
import com.linkshort.feature.auth.dto.*;
import com.linkshort.security.JwtUtil;
import com.linkshort.security.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authManager;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new ConflictException("An account with this email already exists");
        }
        var user = User.builder()
                .name(req.name())
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .build();
        // saveAndFlush ensures @PrePersist (createdAt/updatedAt) is populated
        // on the returned entity before we pass it to buildAuthResponse
        user = userRepository.saveAndFlush(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        // throws BadCredentialsException on failure — handled by GlobalExceptionHandler
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        // Revoke old refresh tokens on login (single-session)
        refreshTokenService.revokeAll(user.getId());
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        var refreshToken = refreshTokenService.findAndValidate(req.refreshToken());
        var user = refreshToken.getUser();
        // Rotate: revoke old, issue new
        refreshTokenService.revoke(req.refreshToken());
        return buildAuthResponse(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            refreshTokenService.revoke(rawRefreshToken);
        }
    }

    // ─────────────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtUtil.generateAccessToken(user);
        var    refreshToken = refreshTokenService.create(user);
        return new AuthResponse(accessToken, refreshToken.getToken(),
                AuthResponse.UserDto.from(user));
    }
}
