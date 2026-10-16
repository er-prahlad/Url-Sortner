package com.linkshort.feature.auth;

import com.linkshort.common.ApiResponse;
import com.linkshort.domain.entity.User;
import com.linkshort.feature.auth.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ApiResponse.ok(authService.register(req), "Account created successfully");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.ok(authService.login(req), "Login successful");
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        return ApiResponse.ok(authService.refresh(req), "Token refreshed");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody(required = false) RefreshRequest req) {
        authService.logout(req != null ? req.refreshToken() : null);
        return ApiResponse.message("Logged out successfully");
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse.UserDto> me(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(AuthResponse.UserDto.from(user));
    }

    /**
     * Forgot-password: always returns 200 to prevent email enumeration.
     * TODO: wire up an email service (SendGrid, SES, etc.) to actually send the link.
     */
    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        // Intentionally silent — do not reveal whether the email exists
        return ApiResponse.message("If that email is registered, a reset link has been sent.");
    }
}
