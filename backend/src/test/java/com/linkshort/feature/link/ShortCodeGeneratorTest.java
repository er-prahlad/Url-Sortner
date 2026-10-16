package com.linkshort.feature.link;

import com.linkshort.domain.repository.LinkRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShortCodeGeneratorTest {

    @Mock   LinkRepository linkRepository;
    @InjectMocks ShortCodeGenerator generator;

    @Test
    void generatesUniqueCode() {
        when(linkRepository.existsByShortCode(anyString())).thenReturn(false);
        String code = generator.generate();
        assertThat(code).hasSize(6).matches("[a-zA-Z0-9]+");
    }

    @Test
    void retriesOnCollision() {
        // First 3 calls collide, 4th is free
        when(linkRepository.existsByShortCode(anyString()))
                .thenReturn(true, true, true, false);
        String code = generator.generate();
        assertThat(code).isNotBlank();
        verify(linkRepository, atLeast(4)).existsByShortCode(anyString());
    }

    @Test
    void producesUniqueCodesAcrossManyGenerations() {
        when(linkRepository.existsByShortCode(anyString())).thenReturn(false);
        Set<String> codes = new HashSet<>();
        for (int i = 0; i < 1000; i++) codes.add(generator.generate());
        // Statistically near-impossible to collide at length 6 across 1000 calls
        assertThat(codes.size()).isGreaterThan(990);
    }
}
