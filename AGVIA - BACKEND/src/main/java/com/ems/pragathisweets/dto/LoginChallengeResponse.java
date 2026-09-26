package com.ems.pragathisweets.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginChallengeResponse {

    @Builder.Default
    private boolean success = true;

    @Builder.Default
    private boolean requiresOtp = true;

    private String challengeId;
    private String phoneMasked;

    @Builder.Default
    private int expiresIn = 300;

    private String message;
    private String token;
    private UserResponse user;
    private String devOtp;
}
