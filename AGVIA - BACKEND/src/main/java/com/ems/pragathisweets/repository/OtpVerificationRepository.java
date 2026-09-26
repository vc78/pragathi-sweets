package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findFirstByTargetAndOtpTypeAndVerifiedFalseOrderByCreatedAtDesc(String target, String otpType);

    void deleteByExpiresAtBefore(LocalDateTime time);
}
