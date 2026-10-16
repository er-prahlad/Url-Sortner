package com.linkshort.feature.qr;

import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.LinkRepository;
import com.linkshort.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

/**
 * GET /api/v1/links/{id}/qr?format=png&size=300&dark=%23000000&light=%23ffffff
 */
@RestController
@RequestMapping("/api/v1/links/{id}/qr")
@RequiredArgsConstructor
public class QRCodeController {

    private final QRCodeService qrCodeService;
    private final LinkRepository linkRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    @GetMapping(produces = { MediaType.IMAGE_PNG_VALUE, "image/svg+xml", MediaType.ALL_VALUE })
    public ResponseEntity<?> generateQr(
            @PathVariable Long id,
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "png") String format,
            @RequestParam(defaultValue = "300") int size,
            @RequestParam(defaultValue = "%23000000") String dark,
            @RequestParam(defaultValue = "%23ffffff") String light) {

        var link = linkRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Link", id));

        String code    = link.getCustomAlias() != null ? link.getCustomAlias() : link.getShortCode();
        String shortUrl = baseUrl + "/" + code;

        String darkHex  = decode(dark);
        String lightHex = decode(light);

        if ("svg".equalsIgnoreCase(format)) {
            String svg = qrCodeService.generateSvg(shortUrl, size, darkHex, lightHex);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("image/svg+xml"))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"qr-" + code + ".svg\"")
                    .body(svg.getBytes(StandardCharsets.UTF_8));
        }

        // Default: PNG
        int darkArgb  = parseHexColor(darkHex,  0xFF000000);
        int lightArgb = parseHexColor(lightHex, 0xFFFFFFFF);
        byte[] png = qrCodeService.generatePng(shortUrl, size, darkArgb, lightArgb);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"qr-" + code + ".png\"")
                .body(png);
    }

    private String decode(String urlEncoded) {
        try {
            return java.net.URLDecoder.decode(urlEncoded, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return urlEncoded;
        }
    }

    private int parseHexColor(String hex, int fallback) {
        try {
            String h = hex.startsWith("#") ? hex.substring(1) : hex;
            return (int) (0xFF000000L | Long.parseLong(h, 16));
        } catch (NumberFormatException e) {
            return fallback;
        }
    }
}
