package com.linkshort.feature.auth.dto;

import jakarta.validation.constraints.*;

public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid address")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {}
