package com.ems.pragathisweets.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpDispatchResponse {
    private String target;
    private String otpType;
    private String channel;
    private String whatsAppUrl;
    private String otpCode;
    private boolean liveEmailSent;
    private boolean liveSmsSent;
    private int expiresInMinutes;
}
