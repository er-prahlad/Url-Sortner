package com.linkshort.feature.link;

import com.linkshort.common.PageResponse;
import com.linkshort.domain.entity.Link;
import com.linkshort.domain.entity.Link.LinkStatus;
import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.LinkRepository;
import com.linkshort.exception.*;
import com.linkshort.feature.link.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LinkService {

    private final LinkRepository linkRepository;
    private final ShortCodeGenerator codeGenerator;
    private final UrlValidator urlValidator;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base-url}")
    private String baseUrl;

    // ── Create ──────────────────────────────────────────────────────────────

    @Transactional
    public LinkResponse create(CreateLinkRequest req, User owner) {
        urlValidator.validate(req.originalUrl());

        if (req.customAlias() != null && linkRepository.existsByCustomAlias(req.customAlias())) {
            throw new ConflictException("Custom alias '" + req.customAlias() + "' is already taken");
        }

        String code = req.customAlias() != null ? null : codeGenerator.generate();

        var link = Link.builder()
                .user(owner)
                .originalUrl(req.originalUrl())
                .shortCode(req.customAlias() != null ? req.customAlias() : code)
                .customAlias(req.customAlias())
                .title(req.title())
                .passwordHash(req.password() != null ? passwordEncoder.encode(req.password()) : null)
                .expiresAt(req.expiresAt() != null ? LocalDateTime.parse(req.expiresAt()) : null)
                .build();

        return LinkResponse.from(linkRepository.save(link), baseUrl);
    }

    // ── Bulk Create ─────────────────────────────────────────────────────────

    @Transactional
    public BulkCreateResponse bulkCreate(BulkCreateRequest req, User owner) {
        var results = new ArrayList<BulkCreateResponse.BulkResult>();
        int success = 0, failure = 0;

        for (CreateLinkRequest item : req.links()) {
            try {
                var created = create(item, owner);
                results.add(BulkCreateResponse.BulkResult.success(created));
                success++;
            } catch (Exception e) {
                results.add(BulkCreateResponse.BulkResult.failure(item.originalUrl(), e.getMessage()));
                failure++;
            }
        }
        return new BulkCreateResponse(results, success, failure);
    }

    // ── List ────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<LinkResponse> list(User owner, String search, String status,
                                           String sort, int page, int size) {
        Pageable pageable = buildPageable(sort, page, size);
        LinkStatus statusEnum = parseStatus(status);

        Page<Link> linkPage;
        if (search != null && !search.isBlank()) {
            linkPage = linkRepository.searchByUserId(owner.getId(), search, statusEnum, pageable);
        } else if (statusEnum != null) {
            linkPage = linkRepository.findByUserIdAndStatus(owner.getId(), statusEnum, pageable);
        } else {
            linkPage = linkRepository.findByUserId(owner.getId(), pageable);
        }

        return new PageResponse<>(linkPage.map(l -> LinkResponse.from(l, baseUrl)));
    }

    // ── Get one ─────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public LinkResponse get(Long id, User owner) {
        return LinkResponse.from(findOwned(id, owner), baseUrl);
    }

    // ── Update ──────────────────────────────────────────────────────────────

    @Transactional
    public LinkResponse update(Long id, UpdateLinkRequest req, User owner) {
        Link link = findOwned(id, owner);

        if (req.customAlias() != null && !req.customAlias().equals(link.getCustomAlias())) {
            if (linkRepository.existsByCustomAlias(req.customAlias())) {
                throw new ConflictException("Custom alias '" + req.customAlias() + "' is already taken");
            }
            link.setCustomAlias(req.customAlias());
            link.setShortCode(req.customAlias());
        }
        if (req.title() != null)     link.setTitle(req.title());
        if (req.status() != null)    link.setStatus(req.status());
        if (req.expiresAt() != null) link.setExpiresAt(LocalDateTime.parse(req.expiresAt()));

        return LinkResponse.from(linkRepository.save(link), baseUrl);
    }

    // ── Delete ──────────────────────────────────────────────────────────────

    @Transactional
    public void delete(Long id, User owner) {
        Link link = findOwned(id, owner);
        linkRepository.delete(link);
    }

    // ── Scheduled expiry ────────────────────────────────────────────────────

    @Scheduled(fixedDelayString = "${app.link-expiry-check-ms:300000}")
    @Transactional
    public void expireLinks() {
        int count = linkRepository.expireLinks(LocalDateTime.now());
        if (count > 0) {
            // log silently – no log dependency here, Spring will emit startup info
        }
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private Link findOwned(Long id, User owner) {
        return linkRepository.findByIdAndUserId(id, owner.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Link", id));
    }

    private Pageable buildPageable(String sort, int page, int size) {
        Sort s = switch (sort != null ? sort : "newest") {
            case "oldest"      -> Sort.by("createdAt").ascending();
            case "most_clicks" -> Sort.by("clicks").descending();
            default            -> Sort.by("createdAt").descending();
        };
        return PageRequest.of(Math.max(0, page - 1), Math.min(size, 100), s);
    }

    private LinkStatus parseStatus(String status) {
        if (status == null || status.isBlank() || "all".equalsIgnoreCase(status)) return null;
        try { return LinkStatus.valueOf(status.toUpperCase()); }
        catch (IllegalArgumentException e) { return null; }
    }

    public Link findByCode(String code) {
        return linkRepository.findByShortCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Short link not found"));
    }
}
