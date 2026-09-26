package com.ems.pragathisweets.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscribers", indexes = {
    @Index(name = "idx_subscribers_email", columnList = "email"),
    @Index(name = "idx_subscribers_active", columnList = "active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "coupon_code", nullable = false, length = 30)
    @Builder.Default
    private String couponCode = "CIRCLE15";

    @Column(name = "discount_percent", nullable = false)
    @Builder.Default
    private Integer discountPercent = 15;

    @Column(name = "valid_till", nullable = false)
    private LocalDateTime validTill;

    @Column(name = "subscribed_at", nullable = false)
    private LocalDateTime subscribedAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        if (subscribedAt == null) {
            subscribedAt = LocalDateTime.now();
        }
        if (validTill == null) {
            validTill = LocalDateTime.now().plusDays(30);
        }
    }
}
