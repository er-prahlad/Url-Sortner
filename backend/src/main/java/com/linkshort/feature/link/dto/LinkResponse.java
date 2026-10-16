package com.linkshort.feature.link.dto;

import com.linkshort.domain.entity.Link;
import org.springframework.beans.factory.annotation.Value;

public record LinkResponse(
        Long   id,
        String originalUrl,
        String shortCode,
        String shortUrl,
        String customAlias,
        String title,
        boolean passwordProtected,
        String status,
        long   clicks,
        String createdAt,
        String updatedAt,
        String expiresAt
) {
    public static LinkResponse from(Link link, String baseUrl) {
        String code = link.getCustomAlias() != null ? link.getCustomAlias() : link.getShortCode();
        return new LinkResponse(
                link.getId(),
                link.getOriginalUrl(),
                link.getShortCode(),
                baseUrl + "/" + code,
                link.getCustomAlias(),
                link.getTitle(),
                link.getPasswordHash() != null,
                link.getStatus().name().toLowerCase(),
                link.getClicks(),
                link.getCreatedAt() != null  ? link.getCreatedAt().toString()  : null,
                link.getUpdatedAt() != null  ? link.getUpdatedAt().toString()  : null,
                link.getExpiresAt() != null  ? link.getExpiresAt().toString()  : null
        );
    }
}
