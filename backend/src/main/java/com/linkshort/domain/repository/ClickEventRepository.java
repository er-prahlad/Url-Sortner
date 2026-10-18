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

    // CAST(... AS date) works on PostgreSQL and CockroachDB
    @Query(value = """
        SELECT CAST(clicked_at AS date) AS day, COUNT(*) AS cnt
        FROM click_events
        WHERE link_id = :linkId
          AND clicked_at >= :since
        GROUP BY CAST(clicked_at AS date)
        ORDER BY CAST(clicked_at AS date)
        """, nativeQuery = true)
    List<Object[]> findDailyClicksByLinkId(
            @Param("linkId") Long linkId,
            @Param("since") LocalDateTime since);

    @Query(value = """
        SELECT CAST(ce.clicked_at AS date) AS day, COUNT(*) AS cnt
        FROM click_events ce
        INNER JOIN links l ON ce.link_id = l.id
        WHERE l.user_id = :userId
          AND ce.clicked_at >= :since
        GROUP BY CAST(ce.clicked_at AS date)
        ORDER BY CAST(ce.clicked_at AS date)
        """, nativeQuery = true)
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

    @Query(value = """
        SELECT SUM(cnt) FROM (
          SELECT COUNT(*) AS cnt
          FROM click_events ce
          INNER JOIN links l ON ce.link_id = l.id
          WHERE l.user_id = :userId
          GROUP BY ce.link_id
        ) sub
        """, nativeQuery = true)
    Long sumTotalClicksByUserId(@Param("userId") Long userId);
}
