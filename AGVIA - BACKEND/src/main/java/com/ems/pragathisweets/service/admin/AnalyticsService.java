package com.ems.pragathisweets.service.admin;

import com.ems.pragathisweets.dto.admin.DashboardResponse;
import com.ems.pragathisweets.dto.admin.SalesReportResponse;
import com.ems.pragathisweets.entity.OrderStatus;
import com.ems.pragathisweets.repository.OrderItemRepository;
import com.ems.pragathisweets.repository.OrderRepository;
import com.ems.pragathisweets.repository.ProductRepository;
import com.ems.pragathisweets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    private static final int LOW_STOCK_THRESHOLD = 10;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime epoch = LocalDateTime.of(2000, 1, 1, 0, 0);

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long lowStock = productRepository.findByStockQuantityLessThanEqualAndActiveTrue(LOW_STOCK_THRESHOLD).size();

        BigDecimal totalRevenue = orderRepository.sumRevenueBetween(epoch, LocalDateTime.now());
        BigDecimal todayRevenue = orderRepository.sumRevenueBetween(startOfToday, endOfToday);
        long todayOrders = orderRepository.countByCreatedAtBetween(startOfToday, endOfToday);

        return DashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .lowStockProducts(lowStock)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .todayOrders(todayOrders)
                .build();
    }

    @Transactional(readOnly = true)
    public SalesReportResponse getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        BigDecimal revenue = orderRepository.sumRevenueBetween(start, end);
        long orderCount = orderRepository.countByCreatedAtBetween(start, end);

        var topProducts = orderItemRepository.findTopSellingProducts().stream()
                .limit(10)
                .map(p -> SalesReportResponse.TopProduct.builder()
                        .productName(p.getName())
                        .unitsSold(p.getTotalSold())
                        .build())
                .toList();

        return SalesReportResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalRevenue(revenue)
                .totalOrders(orderCount)
                .topSellingProducts(topProducts)
                .build();
    }
}
