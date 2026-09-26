package com.ems.pragathisweets.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponse {

    private Long id;
    private Long userId;
    private String email;
    private String customerName;
    private String customerPhone;
    private String planName;
    private String planTier;
    private BigDecimal amount;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String paymentId;
    private String razorpayOrderId;
    private String exclusiveCoupon;
    private Integer discountPercent;
    private LocalDateTime startDate;
    private LocalDateTime validTill;
    private boolean active;
    private long daysRemaining;
    private String razorpayKeyId;
    private LocalDateTime createdAt;
}
