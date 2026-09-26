package com.ems.pragathisweets.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiProductGenerateRequest {
    private String name;
    private String category;
    private String ingredients;
    private String weight;
    private String price;
    private String characteristics;
}
