package com.ems.pragathisweets.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Service health and readiness monitoring endpoints")
public class HealthController {

    private final Instant startTime = Instant.now();

    @GetMapping
    @Operation(summary = "System health check", description = "Returns service liveness, name, and uptime")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("service", "pragathi-sweets-backend");
        response.put("environment", "active");
        response.put("startedAt", startTime.toString());
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }
}
