package com.linkshort.feature.analytics.dto;

import java.util.List;

public record LinkAnalyticsResponse(
        long  totalClicks,
        long  uniqueClicks,
        List<DailyClick>   clicksByDay,
        List<CountryClick> clicksByCountry,
        List<DeviceClick>  clicksByDevice,
        List<BrowserClick> clicksByBrowser,
        List<ReferrerClick> clicksByReferrer
) {
    public record DailyClick(String date, long clicks) {}
    public record CountryClick(String country, String countryCode, long clicks, double percentage) {}
    public record DeviceClick(String device, long clicks, double percentage) {}
    public record BrowserClick(String browser, long clicks, double percentage) {}
    public record ReferrerClick(String referrer, long clicks, double percentage) {}
}
