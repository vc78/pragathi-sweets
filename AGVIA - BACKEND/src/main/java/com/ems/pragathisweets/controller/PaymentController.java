package com.ems.pragathisweets.controller;

import com.ems.pragathisweets.dto.ApiResponse;
import com.ems.pragathisweets.dto.PaymentOrderResponse;
import com.ems.pragathisweets.dto.PaymentVerificationRequest;
import com.ems.pragathisweets.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Razorpay order creation and payment verification")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/razorpay/create/{orderNumber}")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createRazorpayOrder(@PathVariable String orderNumber) {
        PaymentOrderResponse response = paymentService.createRazorpayOrder(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order created", response));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(@Valid @RequestBody PaymentVerificationRequest request) {
        paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", null));
    }

    /**
     * Endpoint for Razorpay server-to-server webhook events (e.g. payment.failed).
     * Configure this URL in the Razorpay dashboard along with a webhook secret,
     * and extend this handler to validate the X-Razorpay-Signature header before
     * acting on the payload in production.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                 @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        // Signature validation and event handling should be implemented here
        // using Utils.verifyWebhookSignature(payload, signature, webhookSecret).
        return ResponseEntity.ok("ok");
    }
}
