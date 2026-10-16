package com.linkshort.feature.analytics.dto;

public record OverviewResponse(
        long  totalLinks,
        long  totalClicks,
        long  activeLinks,
        double avgClicksPerLink,
        double totalLinksChange,
        double totalClicksChange,
        double activeLinksChange,
        double avgClicksChange
) {}
