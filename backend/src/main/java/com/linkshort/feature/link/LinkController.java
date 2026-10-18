package com.linkshort.feature.link;

import com.linkshort.common.*;
import com.linkshort.domain.entity.User;
import com.linkshort.feature.link.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/links")
@RequiredArgsConstructor
public class LinkController {

    private final LinkService linkService;

    /**
     * Public endpoint — no authentication required.
     * Used by the homepage shortener form for anonymous users.
     * Links are saved under the system anonymous user account.
     */
    @PostMapping("/public")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LinkResponse> createPublic(
            @Valid @RequestBody CreateLinkRequest req) {
        return ApiResponse.ok(linkService.createAnonymous(req), "Link created successfully");
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LinkResponse> create(
            @Valid @RequestBody CreateLinkRequest req,
            @AuthenticationPrincipal User user) {
        return ApiResponse.ok(linkService.create(req, user), "Link created successfully");
    }

    @PostMapping("/bulk")
    @ResponseStatus(HttpStatus.MULTI_STATUS)
    public ApiResponse<BulkCreateResponse> bulk(
            @Valid @RequestBody BulkCreateRequest req,
            @AuthenticationPrincipal User user) {
        return ApiResponse.ok(linkService.bulkCreate(req, user));
    }

    @GetMapping
    public PageResponse<LinkResponse> list(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return linkService.list(user, search, status, sort, page, limit);
    }

    @GetMapping("/{id}")
    public ApiResponse<LinkResponse> get(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ApiResponse.ok(linkService.get(id, user));
    }

    @PatchMapping("/{id}")
    public ApiResponse<LinkResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLinkRequest req,
            @AuthenticationPrincipal User user) {
        return ApiResponse.ok(linkService.update(id, req, user), "Link updated");
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        linkService.delete(id, user);
    }
}
