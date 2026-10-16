package com.linkshort.common;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponse<T> {

    private final List<T> data;
    private final PaginationMeta pagination;

    public PageResponse(Page<T> page) {
        this.data = page.getContent();
        this.pagination = new PaginationMeta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public record PaginationMeta(int page, int limit, long total, int totalPages) {}
}
