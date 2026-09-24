package com.ems.pragathisweets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrantSubscriptionRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    private String customerName;
    private String customerPhone;
    private String planName;
    private String planTier;
    private BigDecimal amount;
    private Integer durationDays;
    private String notes;
}
