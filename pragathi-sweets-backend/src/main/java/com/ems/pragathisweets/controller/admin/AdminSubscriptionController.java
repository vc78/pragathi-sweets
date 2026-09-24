package com.ems.pragathisweets.controller.admin;

import com.ems.pragathisweets.dto.ApiResponse;
import com.ems.pragathisweets.dto.GrantSubscriptionRequest;
import com.ems.pragathisweets.dto.SubscriptionResponse;
import com.ems.pragathisweets.dto.SubscriptionStatsResponse;
import com.ems.pragathisweets.entity.SubscriptionStatus;
import com.ems.pragathisweets.service.admin.AdminSubscriptionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Admin - Subscriptions", description = "Admin VIP membership and subscription management")
public class AdminSubscriptionController {

    private final AdminSubscriptionService adminSubscriptionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SubscriptionResponse>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        SubscriptionStatus subStatus = null;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            subStatus = SubscriptionStatus.valueOf(status.toUpperCase());
        }

        return ResponseEntity.ok(ApiResponse.success(adminSubscriptionService.getAll(subStatus, query, pageable)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<SubscriptionStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminSubscriptionService.getStats()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Subscription status updated", adminSubscriptionService.updateStatus(id, status)));
    }

    @PatchMapping("/{id}/extend")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> extendValidity(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success("Subscription extended by " + days + " days", adminSubscriptionService.extendValidity(id, days)));
    }

    @PostMapping("/grant")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> grantSubscription(
            @Valid @RequestBody GrantSubscriptionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("VIP Subscription granted", adminSubscriptionService.grantSubscription(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        adminSubscriptionService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Subscription deleted successfully", null));
    }
}
