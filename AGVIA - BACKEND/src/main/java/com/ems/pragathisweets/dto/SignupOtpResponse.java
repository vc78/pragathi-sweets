package com.ems.pragathisweets.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupOtpResponse {

    @Builder.Default
    private boolean success = true;
    private String message;
    private String challengeId;
    private String phoneMasked;
    @Builder.Default
    private int expiresIn = 300;
    private String devOtp;
}
