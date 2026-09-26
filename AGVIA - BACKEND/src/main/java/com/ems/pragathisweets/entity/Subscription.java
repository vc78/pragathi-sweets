package com.ems.pragathisweets.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions", indexes = {
    @Index(name = "idx_subs_email", columnList = "email"),
    @Index(name = "idx_subs_status", columnList = "status"),
    @Index(name = "idx_subs_user_id", columnList = "user_id"),
    @Index(name = "idx_subs_razorpay_order", columnList = "razorpay_order_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(name = "customer_phone", length = 25)
    private String customerPhone;

    @Column(name = "plan_name", nullable = false, length = 60)
    @Builder.Default
    private String planName = "PRAGATHI_CIRCLE_VIP";

    @Column(name = "plan_tier", nullable = false, length = 30)
    @Builder.Default
    private String planTier = "VIP";

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal amount = new BigDecimal("299.00");

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.PENDING_PAYMENT;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.RAZORPAY;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_id", length = 100)
    private String paymentId;

    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;

    @Column(name = "exclusive_coupon", nullable = false, length = 30)
    @Builder.Default
    private String exclusiveCoupon = "CIRCLE15";

    @Column(name = "discount_percent", nullable = false)
    @Builder.Default
    private Integer discountPercent = 15;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "valid_till", nullable = false)
    private LocalDateTime validTill;

    @Column(name = "auto_renew", nullable = false)
    @Builder.Default
    private boolean autoRenew = true;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.startDate == null) {
            this.startDate = LocalDateTime.now();
        }
        if (this.validTill == null) {
            this.validTill = this.startDate.plusDays(365);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isCurrentlyActive() {
        return this.status == SubscriptionStatus.ACTIVE 
            && this.validTill != null 
            && this.validTill.isAfter(LocalDateTime.now());
    }
}
