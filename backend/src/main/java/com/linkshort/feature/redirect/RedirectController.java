package com.linkshort.feature.redirect;

import com.linkshort.domain.entity.Link;
import com.linkshort.domain.repository.LinkRepository;
import com.linkshort.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;

/**
 * Handles public short-link resolution at GET /{code}.
 * Registered BEFORE the /api/v1/** routes so it doesn't clash.
 */
@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final LinkRepository linkRepository;
    private final ClickTracker clickTracker;

    @GetMapping("/{code:[a-zA-Z0-9_-]{3,30}}")
    public ResponseEntity<Void> redirect(
            @PathVariable String code,
            HttpServletRequest request) {

        Link link = linkRepository.findByShortCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found"));

        // ── Expiry check ─────────────────────────────────────────────────
        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            if (link.getStatus() != Link.LinkStatus.EXPIRED) {
                link.setStatus(Link.LinkStatus.EXPIRED);
                linkRepository.save(link);
            }
            return gone();
        }

        // ── Disabled check ───────────────────────────────────────────────
        if (link.getStatus() == Link.LinkStatus.DISABLED) {
            return gone();
        }

        // ── Password-protected: require query param ───────────────────────
        if (link.getPasswordHash() != null) {
            // Frontend should POST to /api/v1/links/{id}/verify instead.
            // For direct browser navigation we return 403 with a hint.
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // ── Record click asynchronously ──────────────────────────────────
        clickTracker.record(link, request);

        // ── 302 redirect ─────────────────────────────────────────────────
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(link.getOriginalUrl()));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    private ResponseEntity<Void> gone() {
        return ResponseEntity.status(HttpStatus.GONE).build();
    }
}
