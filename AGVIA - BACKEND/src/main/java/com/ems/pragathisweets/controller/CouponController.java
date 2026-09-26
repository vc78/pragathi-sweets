package com.ems.pragathisweets.controller;

import com.ems.pragathisweets.dto.ApiResponse;
import com.ems.pragathisweets.dto.CouponValidationResponse;
import com.ems.pragathisweets.service.CouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon validation for logged-in shoppers")
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<java.util.List<com.ems.pragathisweets.dto.CouponResponse>>> getActiveCoupons() {
        return ResponseEntity.ok(ApiResponse.success(couponService.getActiveCoupons()));
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<CouponValidationResponse>> validate(@RequestParam String code,
                                                                           @RequestParam BigDecimal orderAmount) {
        return ResponseEntity.ok(ApiResponse.success(couponService.validate(code, orderAmount)));
    }
}
