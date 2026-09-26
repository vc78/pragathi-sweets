package com.ems.pragathisweets.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "auth_otp_challenges", indexes = {
    @Index(name = "idx_challenge_id", columnList = "challenge_id", unique = true),
    @Index(name = "idx_otp_phone", columnList = "phone_number"),
    @Index(name = "idx_otp_expires_at", columnList = "expires_at"),
    @Index(name = "idx_otp_status", columnList = "status"),
    @Index(name = "idx_otp_purpose", columnList = "purpose")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthOtpChallenge {

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_VERIFIED = "VERIFIED";
    public static final String STATUS_EXPIRED = "EXPIRED";
    public static final String STATUS_LOCKED = "LOCKED";
    public static final String STATUS_CONSUMED = "CONSUMED";

    public static final String PURPOSE_SIGNUP = "SIGNUP";
    public static final String PURPOSE_LOGIN = "LOGIN";
    public static final String PURPOSE_PHONE_VERIFICATION = "PHONE_VERIFICATION";
    public static final String PURPOSE_PASSWORD_RESET = "PASSWORD_RESET";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "challenge_id", nullable = false, unique = true, length = 64)
    private String challengeId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    @Column(nullable = false, length = 30)
    private String purpose;

    @Column(name = "otp_hash", nullable = false, length = 120)
    private String otpHash;

    @Builder.Default
    @Column(nullable = false, length = 20)
    private String status = STATUS_PENDING;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Builder.Default
    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    @Builder.Default
    @Column(name = "max_attempts", nullable = false)
    private int maxAttempts = 5;

    @Builder.Default
    @Column(name = "resend_count", nullable = false)
    private int resendCount = 0;

    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "consumed_at")
    private LocalDateTime consumedAt;

    @Column(name = "request_ip", length = 100)
    private String requestIp;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    // Temporary registration storage (cleared/consumed upon successful signup)
    @Column(name = "registration_name", length = 120)
    private String registrationName;

    @Column(name = "registration_email", length = 150)
    private String registrationEmail;

    @Column(name = "registration_password_hash", length = 255)
    private String registrationPasswordHash;

    @Column(name = "registration_address", length = 500)
    private String registrationAddress;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.lastSentAt == null) {
            this.lastSentAt = LocalDateTime.now();
        }
        if (this.expiresAt == null) {
            this.expiresAt = LocalDateTime.now().plusSeconds(300);
        }
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isLocked() {
        return STATUS_LOCKED.equalsIgnoreCase(status) || attemptCount >= maxAttempts;
    }

    public boolean isPending() {
        return STATUS_PENDING.equalsIgnoreCase(status) && !isExpired() && !isLocked();
    }
}
