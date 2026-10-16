package com.linkshort.feature.link.dto;

import java.util.List;

public record BulkCreateResponse(
        List<BulkResult> results,
        int successCount,
        int failureCount
) {
    public record BulkResult(String originalUrl, LinkResponse link, String error) {
        public static BulkResult success(LinkResponse link) {
            return new BulkResult(link.originalUrl(), link, null);
        }
        public static BulkResult failure(String originalUrl, String error) {
            return new BulkResult(originalUrl, null, error);
        }
    }
}
