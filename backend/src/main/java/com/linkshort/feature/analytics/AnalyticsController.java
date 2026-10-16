package com.linkshort.feature.analytics;

import com.linkshort.common.ApiResponse;
import com.linkshort.domain.entity.User;
import com.linkshort.feature.analytics.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /** GET /api/v1/analytics/overview */
    @GetMapping("/analytics/overview")
    public ApiResponse<OverviewResponse> overview(@AuthenticationPrincipal User user) {
        return ApiResponse.ok(analyticsService.overview(user));
    }

    /** GET /api/v1/links/{id}/analytics */
    @GetMapping("/links/{id}/analytics")
    public ApiResponse<LinkAnalyticsResponse> linkAnalytics(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ApiResponse.ok(analyticsService.forLink(id, user.getId()));
    }
}
