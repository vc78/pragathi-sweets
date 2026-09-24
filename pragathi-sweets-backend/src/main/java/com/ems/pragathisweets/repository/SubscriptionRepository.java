package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.Subscription;
import com.ems.pragathisweets.entity.SubscriptionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findTopByEmailOrderByCreatedAtDesc(String email);

    Optional<Subscription> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Subscription> findByRazorpayOrderId(String razorpayOrderId);

    Page<Subscription> findByStatus(SubscriptionStatus status, Pageable pageable);

    @Query("SELECT s FROM Subscription s WHERE " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.planName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Subscription> searchSubscriptions(@Param("status") SubscriptionStatus status,
                                           @Param("query") String query,
                                           Pageable pageable);

    long countByStatus(SubscriptionStatus status);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.status = 'ACTIVE' AND s.validTill BETWEEN :start AND :end")
    long countExpiringBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Subscription s WHERE s.status = 'ACTIVE' OR s.paymentStatus = 'SUCCESS'")
    BigDecimal sumSubscriptionRevenue();

    List<Subscription> findByEmailIgnoreCase(String email);
}
