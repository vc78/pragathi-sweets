package com.ems.pragathisweets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendEmailOtpRequest {

    @NotBlank(message = "New email is required")
    @Email(message = "Must be a valid email address")
    private String newEmail;
}
