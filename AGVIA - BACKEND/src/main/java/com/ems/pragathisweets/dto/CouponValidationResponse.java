package com.ems.pragathisweets.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class CouponValidationResponse {

    private boolean valid;
    private String message;
    private String code;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
