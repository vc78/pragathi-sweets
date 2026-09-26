package com.ems.pragathisweets.repository;

import com.ems.pragathisweets.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("select oi.productName as name, sum(oi.quantity) as totalSold " +
            "from OrderItem oi group by oi.productName order by sum(oi.quantity) desc")
    List<ProductSalesProjection> findTopSellingProducts();

    interface ProductSalesProjection {
        String getName();
        Long getTotalSold();
    }
}
