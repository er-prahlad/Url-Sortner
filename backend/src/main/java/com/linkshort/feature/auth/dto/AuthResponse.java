package com.linkshort.feature.auth.dto;

import com.linkshort.domain.entity.User;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserDto user
) {
    public record UserDto(Long id, String name, String email, String role, String createdAt) {
        public static UserDto from(User u) {
            return new UserDto(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getRole().name(),
                    u.getCreatedAt() != null ? u.getCreatedAt().toString() : null
            );
        }
    }
}
