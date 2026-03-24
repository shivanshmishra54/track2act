package com.track2act.controller;

import com.track2act.dto.response.ApiResponse;
import com.track2act.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<com.track2act.dto.response.LocationDTO>>> getLocations() {
        List<com.track2act.dto.response.LocationDTO> locations = shipmentService.getAllLocations();
        return ResponseEntity.ok(ApiResponse.success("Locations fetched", locations));
    }
}
