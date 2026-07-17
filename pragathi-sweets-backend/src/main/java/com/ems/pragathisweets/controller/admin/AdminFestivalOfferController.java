package com.ems.pragathisweets.controller.admin;

import com.ems.pragathisweets.dto.ApiResponse;
import com.ems.pragathisweets.dto.FestivalOfferRequest;
import com.ems.pragathisweets.dto.FestivalOfferResponse;
import com.ems.pragathisweets.service.FestivalOfferService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/festival-offers")
@RequiredArgsConstructor
@Tag(name = "Admin - Festival Offers", description = "Admin seasonal offer management")
public class AdminFestivalOfferController {

    private final FestivalOfferService festivalOfferService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FestivalOfferResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(festivalOfferService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FestivalOfferResponse>> create(@Valid @RequestBody FestivalOfferRequest request) {
        FestivalOfferResponse response = festivalOfferService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Festival offer created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FestivalOfferResponse>> update(@PathVariable Long id,
                                                                      @Valid @RequestBody FestivalOfferRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Festival offer updated", festivalOfferService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        festivalOfferService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Festival offer deactivated", null));
    }
}
