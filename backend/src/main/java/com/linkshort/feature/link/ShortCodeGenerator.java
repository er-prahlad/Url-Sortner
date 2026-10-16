package com.linkshort.feature.link;

import com.linkshort.domain.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

/**
 * Generates URL-safe, collision-resistant short codes.
 * Alphabet: a-z, A-Z, 0-9 (62 chars) → 62^6 ≈ 56 billion possibilities at length 6.
 */
@Component
@RequiredArgsConstructor
public class ShortCodeGenerator {

    private static final String ALPHABET =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int DEFAULT_LENGTH = 6;
    private static final int MAX_RETRIES    = 10;

    private final SecureRandom random = new SecureRandom();
    private final LinkRepository linkRepository;

    public String generate() {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            String code = randomCode(DEFAULT_LENGTH);
            if (!linkRepository.existsByShortCode(code)) {
                return code;
            }
        }
        // Fallback: try longer code
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            String code = randomCode(DEFAULT_LENGTH + 2);
            if (!linkRepository.existsByShortCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to generate a unique short code after retries");
    }

    private String randomCode(int length) {
        var sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
