package com.ems.pragathisweets.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEmailData {

    private Long orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String orderDate;
    private String orderStatus;
    private String statusDescription;
    private List<ItemData> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal deliveryCharge;
    private BigDecimal tax;
    private BigDecimal grandTotal;
    private String paymentMethod;
    private String paymentStatus;
    private String deliveryAddress;
    private String deliveryMethod;
    private String expectedDelivery;
    private String trackingUrl;
    private String notes;
    private String supportPhone;
    private String supportEmail;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemData {
        private String productName;
        private int quantity;
        private BigDecimal unitPrice;
        private BigDecimal total;
    }
}
