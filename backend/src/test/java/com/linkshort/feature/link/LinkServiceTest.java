package com.linkshort.feature.link;

import com.linkshort.domain.entity.Link;
import com.linkshort.domain.entity.User;
import com.linkshort.domain.repository.LinkRepository;
import com.linkshort.exception.ConflictException;
import com.linkshort.exception.ResourceNotFoundException;
import com.linkshort.feature.link.dto.CreateLinkRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinkServiceTest {

    @Mock LinkRepository     linkRepository;
    @Mock ShortCodeGenerator codeGenerator;
    @Mock UrlValidator       urlValidator;

    @InjectMocks LinkService linkService;

    private User owner;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(linkService, "baseUrl", "http://lnks.to");
        // Use real BCrypt for password tests
        ReflectionTestUtils.setField(linkService, "passwordEncoder", new BCryptPasswordEncoder());

        owner = User.builder().id(1L).name("Alice").email("alice@example.com")
                .passwordHash("hash").build();
    }

    // ── create ───────────────────────────────────────────────────────────────

    @Test
    void createsLinkWithGeneratedCode() {
        when(codeGenerator.generate()).thenReturn("abc123");
        var saved = savedLink("abc123", null);
        when(linkRepository.save(any())).thenReturn(saved);

        var req = new CreateLinkRequest("https://example.com", null, null, null, null);
        var res = linkService.create(req, owner);

        assertThat(res.shortCode()).isEqualTo("abc123");
        assertThat(res.shortUrl()).isEqualTo("http://lnks.to/abc123");
        verify(urlValidator).validate("https://example.com");
    }

    @Test
    void createsLinkWithCustomAlias() {
        when(linkRepository.existsByCustomAlias("my-link")).thenReturn(false);
        var saved = savedLink("my-link", "my-link");
        when(linkRepository.save(any())).thenReturn(saved);

        var req = new CreateLinkRequest("https://example.com", "my-link", null, null, null);
        var res = linkService.create(req, owner);

        assertThat(res.customAlias()).isEqualTo("my-link");
        assertThat(res.shortUrl()).isEqualTo("http://lnks.to/my-link");
        verify(codeGenerator, never()).generate();
    }

    @Test
    void throwsConflictOnDuplicateAlias() {
        when(linkRepository.existsByCustomAlias("taken")).thenReturn(true);
        var req = new CreateLinkRequest("https://example.com", "taken", null, null, null);
        assertThatThrownBy(() -> linkService.create(req, owner))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("taken");
    }

    // ── expiry ───────────────────────────────────────────────────────────────

    @Test
    void expiredLinkIsMarkedExpiredOnRetrieve() {
        var pastDate = LocalDateTime.now().minusDays(1).toString();
        when(codeGenerator.generate()).thenReturn("xyz999");
        var saved = savedLink("xyz999", null);
        saved.setExpiresAt(LocalDateTime.now().minusHours(1));
        when(linkRepository.save(any())).thenReturn(saved);

        var req = new CreateLinkRequest("https://example.com", null, null, pastDate, null);
        var res = linkService.create(req, owner);
        // isExpired() is a domain method — test directly on entity
        assertThat(saved.isExpired()).isTrue();
        assertThat(saved.isAccessible()).isFalse();
    }

    // ── delete with ownership ────────────────────────────────────────────────

    @Test
    void deleteOwnedLinkSucceeds() {
        var link = savedLink("abc123", null);
        when(linkRepository.findByIdAndUserId(1L, owner.getId())).thenReturn(Optional.of(link));
        assertThatNoException().isThrownBy(() -> linkService.delete(1L, owner));
        verify(linkRepository).delete(link);
    }

    @Test
    void deleteNonOwnedLinkThrows() {
        when(linkRepository.findByIdAndUserId(99L, owner.getId())).thenReturn(Optional.empty());
        assertThatThrownBy(() -> linkService.delete(99L, owner))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private Link savedLink(String code, String alias) {
        return Link.builder()
                .id(1L).user(owner)
                .originalUrl("https://example.com")
                .shortCode(code).customAlias(alias)
                .status(Link.LinkStatus.ACTIVE).clicks(0L)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
    }
}
