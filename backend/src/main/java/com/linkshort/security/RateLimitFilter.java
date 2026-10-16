package com.linkshort.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-process token-bucket rate limiter per IP.
 * For production, replace with a Redis-backed solution (e.g., Bucket4j + Redis).
 */
@Component
@Order(1)
@Slf4j
public class RateLimitFilter implements Filter {

    @Value("${app.rate-limit.auth-max-requests:10}")
    private int authMaxRequests;

    @Value("${app.rate-limit.link-max-requests:60}")
    private int linkMaxRequests;

    @Value("${app.rate-limit.window-seconds:60}")
    private int windowSeconds;

    private record Window(AtomicInteger count, long expiresAt) {}

    private final Map<String, Window> authWindows = new ConcurrentHashMap<>();
    private final Map<String, Window> linkWindows = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        var request  = (HttpServletRequest)  req;
        var response = (HttpServletResponse) res;

        String ip   = extractIp(request);
        String path = request.getRequestURI();

        if (path.startsWith("/api/v1/auth/")) {
            if (isRateLimited(ip, authWindows, authMaxRequests)) {
                sendTooManyRequests(response, "Too many authentication attempts. Try again later.");
                return;
            }
        } else if (path.startsWith("/api/v1/links")) {
            if (isRateLimited(ip, linkWindows, linkMaxRequests)) {
                sendTooManyRequests(response, "Too many requests. Slow down.");
                return;
            }
        }

        chain.doFilter(req, res);
    }

    private boolean isRateLimited(String ip, Map<String, Window> windows, int maxRequests) {
        long now = System.currentTimeMillis();
        long windowEnd = now + (windowSeconds * 1000L);

        windows.compute(ip, (k, existing) -> {
            if (existing == null || now > existing.expiresAt()) {
                return new Window(new AtomicInteger(1), windowEnd);
            }
            existing.count().incrementAndGet();
            return existing;
        });

        Window w = windows.get(ip);
        return w != null && w.count().get() > maxRequests;
    }

    private void sendTooManyRequests(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(
                "{\"success\":false,\"message\":\"" + message + "\"}"
        );
    }

    private String extractIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
