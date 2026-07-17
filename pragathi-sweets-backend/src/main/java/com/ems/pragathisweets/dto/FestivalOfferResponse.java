package com.ems.pragathisweets.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class FestivalOfferResponse {

    private Long id;
    private String title;
    private String description;
    private Double discountPercentage;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private boolean live;
}
