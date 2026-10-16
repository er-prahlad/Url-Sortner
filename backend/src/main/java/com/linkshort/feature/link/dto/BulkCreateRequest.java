package com.linkshort.feature.link.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record BulkCreateRequest(
        @NotNull @Size(min = 1, max = 50, message = "Provide 1–50 URLs per bulk request")
        List<@Valid CreateLinkRequest> links
) {}
