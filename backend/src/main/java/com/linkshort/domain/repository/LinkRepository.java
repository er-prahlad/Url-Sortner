package com.linkshort.domain.repository;

import com.linkshort.domain.entity.Link;
import com.linkshort.domain.entity.Link.LinkStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {

    Optional<Link> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    Optional<Link> findByIdAndUserId(Long id, Long userId);

    Page<Link> findByUserId(Long userId, Pageable pageable);

    Page<Link> findByUserIdAndStatus(Long userId, LinkStatus status, Pageable pageable);

    @Query("""
        SELECT l FROM Link l
        WHERE l.user.id = :userId
          AND (:search IS NULL OR LOWER(l.originalUrl) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(l.shortCode) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(COALESCE(l.customAlias,'')) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:status IS NULL OR l.status = :status)
        """)
    Page<Link> searchByUserId(
            @Param("userId") Long userId,
            @Param("search") String search,
            @Param("status") LinkStatus status,
            Pageable pageable);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, LinkStatus status);

    @Query("SELECT SUM(l.clicks) FROM Link l WHERE l.user.id = :userId")
    Long sumClicksByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Link l SET l.status = com.linkshort.domain.entity.Link.LinkStatus.EXPIRED WHERE l.expiresAt < :now AND l.status = com.linkshort.domain.entity.Link.LinkStatus.ACTIVE")
    int expireLinks(@Param("now") LocalDateTime now);

    @Query("SELECT l FROM Link l WHERE l.user.id = :userId ORDER BY l.clicks DESC")
    List<Link> findTopByUserIdOrderByClicksDesc(@Param("userId") Long userId, Pageable pageable);
}
