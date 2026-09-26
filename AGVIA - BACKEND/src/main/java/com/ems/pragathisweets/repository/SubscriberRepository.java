package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    Optional<Subscriber> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    java.util.List<Subscriber> findByCouponCodeIgnoreCase(String couponCode);
    boolean existsByCouponCodeIgnoreCase(String couponCode);
}
