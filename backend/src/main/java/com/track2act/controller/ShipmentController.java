package com.track2act.controller;

import com.track2act.dto.request.CreateShipmentRequest;
import com.track2act.dto.response.ApiResponse;
import com.track2act.dto.response.ShipmentDTO;
import com.track2act.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShipmentDTO>> getShipment(@PathVariable UUID id) {
        ShipmentDTO shipment = shipmentService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("Shipment fetched", shipment));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATIONS_MANAGER')")
    public ResponseEntity<ApiResponse<ShipmentDTO>> createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        ShipmentDTO shipment = shipmentService.create(request);
        return ResponseEntity.ok(ApiResponse.success("Shipment created", shipment));
    }
}


