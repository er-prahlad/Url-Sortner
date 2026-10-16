package com.linkshort.feature.link;

import com.linkshort.exception.BadRequestException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.*;

class UrlValidatorTest {

    private final UrlValidator validator = new UrlValidator();

    @ParameterizedTest
    @ValueSource(strings = {
            "https://google.com",
            "http://example.com/path?q=1",
            "https://sub.domain.co.uk/path",
    })
    void validUrlsPasses(String url) {
        assertThatNoException().isThrownBy(() -> validator.validate(url));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "ftp://files.example.com",
            "javascript:alert(1)",
            "file:///etc/passwd",
            "data:text/html,<h1>hi</h1>",
    })
    void blocksNonHttpSchemes(String url) {
        assertThatThrownBy(() -> validator.validate(url))
                .isInstanceOf(BadRequestException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "http://localhost/app",
            "http://127.0.0.1/",
            "http://169.254.169.254/latest/meta-data/",
            "http://192.168.1.1/admin",
            "http://10.0.0.1/",
    })
    void blocksPrivateAddresses(String url) {
        assertThatThrownBy(() -> validator.validate(url))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void blocksMalformedUrl() {
        assertThatThrownBy(() -> validator.validate("not a url"))
                .isInstanceOf(BadRequestException.class);
    }
}
