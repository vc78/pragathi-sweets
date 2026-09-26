package com.ems.pragathisweets.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiProductGenerateResponse {
    private String name;
    private String description;
    private String shortDescription;
    private String suggestedCategory;
    private List<String> tags;
    private List<String> highlights;
    private String seoDescription;
}
