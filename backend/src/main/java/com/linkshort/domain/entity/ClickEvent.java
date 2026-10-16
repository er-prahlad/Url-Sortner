package com.linkshort.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "link_id", nullable = false)
    private Link link;

    @Column(name = "clicked_at", nullable = false)
    @Builder.Default
    private LocalDateTime clickedAt = LocalDateTime.now();

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(length = 2048)
    private String referer;

    @Column(length = 100)
    private String country;

    @Column(name = "country_code", length = 10)
    private String countryCode;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(length = 100)
    private String browser;

    @PrePersist
    void prePersist() {
        if (clickedAt == null) clickedAt = LocalDateTime.now();
    }
}
