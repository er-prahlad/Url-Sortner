package com.linkshort.feature.qr;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.linkshort.exception.BadRequestException;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.EnumMap;
import java.util.Map;

@Service
public class QRCodeService {

    private static final int DEFAULT_SIZE = 300;
    private static final int MAX_SIZE     = 1024;
    private static final int MIN_SIZE     = 64;

    /**
     * Generate a PNG QR code as a byte array.
     *
     * @param content   URL or text to encode
     * @param size      pixel width/height (64–1024)
     * @param darkColor  ARGB int for dark modules  (e.g. 0xFF000000)
     * @param lightColor ARGB int for light modules (e.g. 0xFFFFFFFF)
     */
    public byte[] generatePng(String content, int size, int darkColor, int lightColor) {
        int clampedSize = clamp(size);
        BitMatrix matrix = encode(content, clampedSize);

        var config = new MatrixToImageConfig(darkColor, lightColor);
        try (var baos = new ByteArrayOutputStream()) {
            MatrixToImageWriter.writeToStream(matrix, "PNG", baos, config);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PNG QR code", e);
        }
    }

    /**
     * Generate an SVG QR code string.
     */
    public String generateSvg(String content, int size, String darkHex, String lightHex) {
        int clampedSize = clamp(size);
        BitMatrix matrix = encode(content, clampedSize);

        int width  = matrix.getWidth();
        int height = matrix.getHeight();
        int moduleSize = clampedSize / width;

        var sb = new StringBuilder();
        sb.append("""
                <?xml version="1.0" encoding="UTF-8"?>
                <svg xmlns="http://www.w3.org/2000/svg" \
                """)
          .append("width=\"").append(clampedSize).append("\" ")
          .append("height=\"").append(clampedSize).append("\" ")
          .append("viewBox=\"0 0 ").append(clampedSize).append(" ").append(clampedSize).append("\">\n")
          .append("<rect width=\"").append(clampedSize).append("\" height=\"").append(clampedSize)
          .append("\" fill=\"").append(escapeXml(lightHex)).append("\"/>\n");

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                if (matrix.get(x, y)) {
                    sb.append("<rect x=\"").append(x * moduleSize)
                      .append("\" y=\"").append(y * moduleSize)
                      .append("\" width=\"").append(moduleSize)
                      .append("\" height=\"").append(moduleSize)
                      .append("\" fill=\"").append(escapeXml(darkHex)).append("\"/>\n");
                }
            }
        }
        sb.append("</svg>");
        return sb.toString();
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private BitMatrix encode(String content, int size) {
        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 2);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        try {
            return new QRCodeWriter().encode(content, BarcodeFormat.QR_CODE, size, size, hints);
        } catch (WriterException e) {
            throw new BadRequestException("Could not encode QR code: " + e.getMessage());
        }
    }

    private int clamp(int size) {
        if (size <= 0) return DEFAULT_SIZE;
        return Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
    }

    private String escapeXml(String s) {
        return s == null ? "#000000" : s.replace("&", "&amp;").replace("<", "&lt;").replace("\"", "&quot;");
    }
}
