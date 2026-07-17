package com.ems.pragathisweets.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class DashboardResponse {

    private long totalUsers;
    private long totalProducts;
    private long totalOrders;
    private long pendingOrders;
    private long lowStockProducts;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private long todayOrders;
}
