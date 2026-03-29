package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class LocationUpdateRequest {

    @NotNull(message = "Shipment ID is required")
    private UUID shipmentId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String statusNote;
}
