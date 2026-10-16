package com.linkshort.feature.link;

import com.linkshort.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Set;

/**
 * Validates destination URLs against disallowed schemes and known malicious patterns.
 */
@Component
public class UrlValidator {

    private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");

    // Block loopback, private ranges, and link-local addresses
    private static final Set<String> BLOCKED_HOSTS = Set.of(
            "localhost", "127.0.0.1", "0.0.0.0", "::1",
            "169.254.169.254"  // AWS metadata endpoint
    );

    public void validate(String url) {
        URI uri;
        try {
            uri = URI.create(url);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid URL format");
        }

        String scheme = uri.getScheme();
        if (scheme == null || !ALLOWED_SCHEMES.contains(scheme.toLowerCase())) {
            throw new BadRequestException("URL must use http or https scheme");
        }

        String host = uri.getHost();
        if (host == null || host.isBlank()) {
            throw new BadRequestException("URL must have a valid host");
        }

        if (BLOCKED_HOSTS.contains(host.toLowerCase())) {
            throw new BadRequestException("Destination URL is not allowed");
        }

        // Block private IP ranges
        if (isPrivateIpPattern(host)) {
            throw new BadRequestException("Destination URL points to a private network address");
        }
    }

    private boolean isPrivateIpPattern(String host) {
        return host.startsWith("10.") ||
               host.startsWith("192.168.") ||
               host.startsWith("172.16.") ||
               host.startsWith("172.17.") ||
               host.startsWith("172.18.") ||
               host.startsWith("172.19.") ||
               host.startsWith("172.2")   ||
               host.startsWith("172.30.") ||
               host.startsWith("172.31.");
    }
}
