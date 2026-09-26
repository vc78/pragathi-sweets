package com.ems.pragathisweets.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionStatsResponse {

    private long totalSubscribers;
    private long activeSubscribers;
    private long pendingSubscribers;
    private long expiringThisMonth;
    private BigDecimal totalRevenue;
}
