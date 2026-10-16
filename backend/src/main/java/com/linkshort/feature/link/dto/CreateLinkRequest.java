package com.linkshort.feature.link.dto;

import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

public record CreateLinkRequest(

        @NotBlank(message = "Original URL is required")
        @URL(message = "Must be a valid HTTP or HTTPS URL")
        @Size(max = 2048, message = "URL must not exceed 2048 characters")
        String originalUrl,

        @Pattern(
            regexp = "^[a-zA-Z0-9_-]{3,30}$",
            message = "Alias must be 3–30 characters: letters, numbers, hyphens, underscores only"
        )
        String customAlias,

        @Size(max = 200, message = "Title must not exceed 200 characters")
        String title,

        String expiresAt,   // ISO-8601 datetime string, optional

        @Size(max = 100, message = "Password must not exceed 100 characters")
        String password
) {}
