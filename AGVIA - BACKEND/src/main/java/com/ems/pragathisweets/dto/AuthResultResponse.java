package com.ems.pragathisweets.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResultResponse {

    @Builder.Default
    private boolean success = true;

    private String message;
    private String token;
    private UserResponse user;
}
