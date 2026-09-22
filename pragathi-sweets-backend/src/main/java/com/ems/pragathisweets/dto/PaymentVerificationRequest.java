package com.ems.pragathisweets.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationRequest {

    @NotBlank
    @JsonProperty("razorpayOrderId")
    @JsonAlias({"razorpay_order_id", "orderId", "order_id"})
    private String razorpayOrderId;

    @NotBlank
    @JsonProperty("razorpayPaymentId")
    @JsonAlias({"razorpay_payment_id", "paymentId", "payment_id"})
    private String razorpayPaymentId;

    @NotBlank
    @JsonProperty("razorpaySignature")
    @JsonAlias({"razorpay_signature", "signature"})
    private String razorpaySignature;

    @NotBlank
    @JsonProperty("internalOrderNumber")
    @JsonAlias({"internal_order_number", "orderNumber", "order_number"})
    private String internalOrderNumber;
}
