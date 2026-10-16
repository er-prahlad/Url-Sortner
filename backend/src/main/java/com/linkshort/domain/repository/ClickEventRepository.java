package com.linkshort.domain.repository;

import com.linkshort.domain.entity.ClickEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    long countByLinkId(Long linkId);

    long countByLinkIdAndClickedAtAfter(Long linkId, LocalDateTime after);

    @Query("""
        SELECT COUNT(DISTINCT c.ipAddress)
        FROM ClickEvent c
        WHERE c.link.id = :linkId
        """)
    long countUniqueClicksByLinkId(@Param("linkId") Long linkId);

    @Query("""
        SELECT FUNCTION('DATE', c.clickedAt) AS day, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.id = :linkId
          AND c.clickedAt >= :since
        GROUP BY FUNCTION('DATE', c.clickedAt)
        ORDER BY FUNCTION('DATE', c.clickedAt)
        """)
    List<Object[]> findDailyClicksByLinkId(
            @Param("linkId") Long linkId,
            @Param("since") LocalDateTime since);

    @Query("""
        SELECT FUNCTION('DATE', c.clickedAt) AS day, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.user.id = :userId
          AND c.clickedAt >= :since
        GROUP BY FUNCTION('DATE', c.clickedAt)
        ORDER BY FUNCTION('DATE', c.clickedAt)
        """)
    List<Object[]> findDailyClicksByUserId(
            @Param("userId") Long userId,
            @Param("since") LocalDateTime since);

    @Query("""
        SELECT c.country, c.countryCode, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.id = :linkId
          AND c.country IS NOT NULL
        GROUP BY c.country, c.countryCode
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByCountryForLink(@Param("linkId") Long linkId);

    @Query("""
        SELECT c.country, c.countryCode, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.user.id = :userId
          AND c.country IS NOT NULL
        GROUP BY c.country, c.countryCode
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByCountryForUser(@Param("userId") Long userId);

    @Query("""
        SELECT c.deviceType, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.id = :linkId
          AND c.deviceType IS NOT NULL
        GROUP BY c.deviceType
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByDeviceForLink(@Param("linkId") Long linkId);

    @Query("""
        SELECT c.deviceType, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.user.id = :userId
          AND c.deviceType IS NOT NULL
        GROUP BY c.deviceType
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByDeviceForUser(@Param("userId") Long userId);

    @Query("""
        SELECT c.browser, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.id = :linkId
          AND c.browser IS NOT NULL
        GROUP BY c.browser
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByBrowserForLink(@Param("linkId") Long linkId);

    @Query("""
        SELECT c.referer, COUNT(c) AS cnt
        FROM ClickEvent c
        WHERE c.link.id = :linkId
          AND c.referer IS NOT NULL
        GROUP BY c.referer
        ORDER BY cnt DESC
        """)
    List<Object[]> findClicksByReferrerForLink(@Param("linkId") Long linkId);

    @Query("""
        SELECT SUM(cnt) FROM (
          SELECT COUNT(c) AS cnt
          FROM ClickEvent c
          WHERE c.link.user.id = :userId
          GROUP BY c.link.id
        ) sub
        """)
    Long sumTotalClicksByUserId(@Param("userId") Long userId);
}
