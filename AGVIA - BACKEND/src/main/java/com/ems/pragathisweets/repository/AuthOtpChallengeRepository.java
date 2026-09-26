package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.AuthOtpChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AuthOtpChallengeRepository extends JpaRepository<AuthOtpChallenge, Long> {

    Optional<AuthOtpChallenge> findByChallengeId(String challengeId);

    long countByPhoneNumberAndCreatedAtAfter(String phoneNumber, LocalDateTime after);

    long countByRequestIpAndCreatedAtAfter(String requestIp, LocalDateTime after);

    Optional<AuthOtpChallenge> findTopByPhoneNumberAndPurposeAndStatusOrderByCreatedAtDesc(
            String phoneNumber, String purpose, String status);
}
