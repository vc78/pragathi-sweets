package com.ems.pragathisweets.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PaymentOrderResponse {

    private String razorpayOrderId;
    private String razorpayKeyId;
    private long amountInPaise;
    private String currency;
    private Long internalOrderId;
    private String orderNumber;
}
