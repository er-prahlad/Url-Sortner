package com.linkshort.feature.auth.dto;

import jakarta.validation.constraints.*;

public record ForgotPasswordRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid address")
        String email
) {}
