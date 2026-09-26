package com.ems.pragathisweets.service.otp;

public interface OtpDeliveryService {

    /**
     * Sends a 6-digit OTP code to the recipient's mobile number.
     *
     * @param phoneNumber recipient's phone number in E.164 format
     * @param otp 6-digit OTP code
     * @param purpose purpose of the OTP (SIGNUP, LOGIN, etc.)
     */
    void sendOtp(String phoneNumber, String otp, String purpose);
}
