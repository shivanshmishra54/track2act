package com.track2act.controller;

import com.track2act.dto.request.CreateShipmentRequest;
import com.track2act.dto.request.UpdateShipmentRequest;
import com.track2act.dto.request.LocationUpdateRequest;
import com.track2act.dto.request.DriverStatusUpdateRequest;
import com.track2act.dto.response.ApiResponse;
import com.track2act.dto.response.ShipmentDTO;
import com.track2act.dto.response.DashboardStatsDTO;
import com.track2act.dto.response.TrackingUpdateDTO;
import com.track2act.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ShipmentDTO>>> getActiveShipments() {
        List<ShipmentDTO> shipments = shipmentService.getActiveShipments();
        return ResponseEntity.ok(ApiResponse.success("Active shipments fetched", shipments));
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<ApiResponse<List<ShipmentDTO>>> getShipmentsByDriver(@PathVariable UUID driverId) {
        List<ShipmentDTO> shipments = shipmentService.getShipmentsByDriver(driverId);
        return ResponseEntity.ok(ApiResponse.success("Driver shipments fetched", shipments));
    }

    @GetMapping("/created-by/{creatorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_OFFICER')")
    public ResponseEntity<ApiResponse<List<ShipmentDTO>>> getShipmentsByCreator(@PathVariable UUID creatorId) {
        List<ShipmentDTO> shipments = shipmentService.getShipmentsByCreator(creatorId);
        return ResponseEntity.ok(ApiResponse.success("Created shipments fetched", shipments));
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<ShipmentDTO>>> getMyCustomerShipments() {
        return ResponseEntity.ok(ApiResponse.success("My shipments fetched", shipmentService.getMyCustomerShipments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShipmentDTO>> getShipment(@PathVariable UUID id) {
        ShipmentDTO shipment = shipmentService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Shipment fetched", shipment));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_OFFICER')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        ShipmentDTO shipment = shipmentService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Shipment created", shipment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_OFFICER')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> updateShipment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateShipmentRequest request) {
        ShipmentDTO shipment = shipmentService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Shipment updated", shipment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_OFFICER')")
    public ResponseEntity<ApiResponse<Void>> deleteShipment(@PathVariable UUID id) {
        shipmentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Shipment deleted", null));
    }

    @PostMapping("/location-update")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> updateLocation(@Valid @RequestBody LocationUpdateRequest request) {
        ShipmentDTO shipment = shipmentService.updateLocation(request);
        return ResponseEntity.ok(ApiResponse.success("Location updated", shipment));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> updateDriverStatus(
            @PathVariable UUID id,
            @Valid @RequestBody DriverStatusUpdateRequest request) {
        ShipmentDTO shipment = shipmentService.updateDriverStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", shipment));
    }

    @GetMapping("/{id}/tracking-history")
    public ResponseEntity<ApiResponse<List<TrackingUpdateDTO>>> getTrackingHistory(@PathVariable UUID id) {
        List<TrackingUpdateDTO> history = shipmentService.getTrackingHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Tracking history fetched", history));
    }

@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_OFFICER', 'ANALYST')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = shipmentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Stats fetched", stats));
    }
}


