package com.ems.pragathisweets.service.otp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
@RequiredArgsConstructor
@Slf4j
public class CompositeOtpDeliveryService implements OtpDeliveryService {

    private final TwilioOtpDeliveryService twilioOtpDeliveryService;
    private final MockOtpDeliveryService mockOtpDeliveryService;

    @Value("${otp.provider:composite}")
    private String configuredProvider;

    @Override
    public void sendOtp(String phoneNumber, String otp, String purpose) {
        if ("twilio".equalsIgnoreCase(configuredProvider)) {
            twilioOtpDeliveryService.sendOtp(phoneNumber, otp, purpose);
        } else if ("mock".equalsIgnoreCase(configuredProvider)) {
            mockOtpDeliveryService.sendOtp(phoneNumber, otp, purpose);
        } else {
            // Default "composite": dispatch via Twilio SMS AND log to terminal
            try {
                twilioOtpDeliveryService.sendOtp(phoneNumber, otp, purpose);
            } catch (Exception e) {
                log.warn("[OTP_DELIVERY] Twilio SMS dispatch attempted: {}", e.getMessage());
            }
            mockOtpDeliveryService.sendOtp(phoneNumber, otp, purpose);
        }
    }
}
