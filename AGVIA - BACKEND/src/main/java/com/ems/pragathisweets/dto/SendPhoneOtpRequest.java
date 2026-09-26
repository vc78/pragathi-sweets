package com.ems.pragathisweets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendPhoneOtpRequest {

    @NotBlank(message = "New phone number is required")
    private String newPhone;
}
