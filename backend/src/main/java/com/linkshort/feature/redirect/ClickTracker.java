package com.linkshort.feature.redirect;

import com.linkshort.domain.entity.ClickEvent;
import com.linkshort.domain.entity.Link;
import com.linkshort.domain.repository.ClickEventRepository;
import com.linkshort.domain.repository.LinkRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class ClickTracker {

    private final ClickEventRepository clickEventRepository;
    private final LinkRepository linkRepository;

    @Async
    @Transactional
    public void record(Link link, HttpServletRequest request) {
        String userAgent  = truncate(request.getHeader("User-Agent"), 512);
        String referer    = truncate(request.getHeader("Referer"), 2048);
        String ip         = extractIp(request);
        String deviceType = detectDevice(userAgent);
        String browser    = detectBrowser(userAgent);

        var event = ClickEvent.builder()
                .link(link)
                .ipAddress(ip)
                .userAgent(userAgent)
                .referer(referer)
                .deviceType(deviceType)
                .browser(browser)
                .build();

        clickEventRepository.save(event);

        // Increment denormalised counter
        linkRepository.findById(link.getId()).ifPresent(l -> {
            l.setClicks(l.getClicks() + 1);
            linkRepository.save(l);
        });
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private String extractIp(HttpServletRequest req) {
        String forwarded = req.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

    private String detectDevice(String ua) {
        if (ua == null) return "Unknown";
        String u = ua.toLowerCase();
        if (u.contains("tablet") || u.contains("ipad"))               return "Tablet";
        if (u.contains("mobile") || u.contains("android")
                || u.contains("iphone"))                               return "Mobile";
        return "Desktop";
    }

    private String detectBrowser(String ua) {
        if (ua == null) return "Unknown";
        String u = ua.toLowerCase();
        if (u.contains("edg/"))                 return "Edge";
        if (u.contains("opr/") || u.contains("opera")) return "Opera";
        if (u.contains("chrome"))               return "Chrome";
        if (u.contains("safari"))               return "Safari";
        if (u.contains("firefox"))              return "Firefox";
        if (u.contains("msie") || u.contains("trident")) return "IE";
        return "Other";
    }

    private String truncate(String value, int max) {
        if (value == null) return null;
        return value.length() > max ? value.substring(0, max) : value;
    }
}
