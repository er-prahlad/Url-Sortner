package com.linkshort.security;

import com.linkshort.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Extracted into its own class to break the circular dependency:
 *   JwtAuthFilter → UserDetailsService → SecurityConfig → JwtAuthFilter
 *
 * UserDetailsService and PasswordEncoder are now independent beans,
 * resolved before SecurityConfig or JwtAuthFilter are created.
 */
@Configuration
@RequiredArgsConstructor
public class AppBeans {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
