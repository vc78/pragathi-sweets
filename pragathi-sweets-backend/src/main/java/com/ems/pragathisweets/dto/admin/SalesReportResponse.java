package com.ems.pragathisweets.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class SalesReportResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalRevenue;
    private long totalOrders;
    private List<TopProduct> topSellingProducts;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    public static class TopProduct {
        private String productName;
        private long unitsSold;
    }
}
