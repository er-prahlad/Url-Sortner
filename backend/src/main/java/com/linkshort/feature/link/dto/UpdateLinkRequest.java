package com.linkshort.feature.link.dto;

import com.linkshort.domain.entity.Link.LinkStatus;
import jakarta.validation.constraints.*;

public record UpdateLinkRequest(

        @Pattern(
            regexp = "^[a-zA-Z0-9_-]{3,30}$",
            message = "Alias must be 3–30 characters: letters, numbers, hyphens, underscores only"
        )
        String customAlias,

        @Size(max = 200)
        String title,

        String expiresAt,

        LinkStatus status
) {}
