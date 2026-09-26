package com.ems.pragathisweets.controller;

import com.ems.pragathisweets.dto.ApiResponse;
import com.ems.pragathisweets.dto.FestivalOfferResponse;
import com.ems.pragathisweets.service.FestivalOfferService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/festival-offers")
@RequiredArgsConstructor
@Tag(name = "Festival Offers", description = "Public seasonal/festival offers")
public class FestivalOfferController {

    private final FestivalOfferService festivalOfferService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FestivalOfferResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(festivalOfferService.getActive()));
    }
}
