package com.linkshort.feature.analytics;

import com.linkshort.domain.entity.Link.LinkStatus;
import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.ClickEventRepository;
import com.linkshort.domain.repository.LinkRepository;
import com.linkshort.exception.ResourceNotFoundException;
import com.linkshort.feature.analytics.dto.*;
import com.linkshort.feature.analytics.dto.LinkAnalyticsResponse.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final LinkRepository       linkRepository;
    private final ClickEventRepository clickEventRepository;

    // ── Dashboard overview ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public OverviewResponse overview(User user) {
        long totalLinks  = linkRepository.countByUserId(user.getId());
        long activeLinks = linkRepository.countByUserIdAndStatus(user.getId(), LinkStatus.ACTIVE);
        Long rawClicks   = linkRepository.sumClicksByUserId(user.getId());
        long totalClicks = rawClicks != null ? rawClicks : 0L;
        double avg       = totalLinks > 0 ? (double) totalClicks / totalLinks : 0.0;

        // Percentage-change placeholders (requires historical snapshot – not yet stored)
        return new OverviewResponse(totalLinks, totalClicks, activeLinks, avg, 0, 0, 0, 0);
    }

    // ── Per-link analytics ──────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public LinkAnalyticsResponse forLink(Long linkId, Long userId) {
        // ownership check
        linkRepository.findByIdAndUserId(linkId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Link", linkId));

        long total  = clickEventRepository.countByLinkId(linkId);
        long unique = clickEventRepository.countUniqueClicksByLinkId(linkId);

        LocalDateTime since30 = LocalDateTime.now().minusDays(30);

        List<DailyClick> daily = clickEventRepository
                .findDailyClicksByLinkId(linkId, since30)
                .stream()
                .map(r -> new DailyClick(r[0].toString(), ((Number) r[1]).longValue()))
                .collect(Collectors.toList());

        List<CountryClick> countries = toPercentage(
                clickEventRepository.findClicksByCountryForLink(linkId), total,
                r -> new CountryClick(str(r[0]), str(r[1]), num(r[2]), 0))
                .stream()
                .map(c -> new CountryClick(c.country(), c.countryCode(), c.clicks(),
                        pct(c.clicks(), total)))
                .collect(Collectors.toList());

        List<DeviceClick> devices = clickEventRepository
                .findClicksByDeviceForLink(linkId)
                .stream()
                .map(r -> new DeviceClick(str(r[0]), num(r[1]), pct(num(r[1]), total)))
                .collect(Collectors.toList());

        List<BrowserClick> browsers = clickEventRepository
                .findClicksByBrowserForLink(linkId)
                .stream()
                .map(r -> new BrowserClick(str(r[0]), num(r[1]), pct(num(r[1]), total)))
                .collect(Collectors.toList());

        List<ReferrerClick> referrers = clickEventRepository
                .findClicksByReferrerForLink(linkId)
                .stream()
                .map(r -> new ReferrerClick(str(r[0]), num(r[1]), pct(num(r[1]), total)))
                .collect(Collectors.toList());

        return new LinkAnalyticsResponse(total, unique, daily, countries, devices, browsers, referrers);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private <T> List<T> toPercentage(List<Object[]> rows, long total,
            java.util.function.Function<Object[], T> mapper) {
        return rows.stream().map(mapper).collect(Collectors.toList());
    }

    private String str(Object o) { return o != null ? o.toString() : null; }
    private long   num(Object o) { return o instanceof Number n ? n.longValue() : 0L; }
    private double pct(long part, long total) {
        return total == 0 ? 0.0 : Math.round((double) part / total * 10000.0) / 100.0;
    }
}
