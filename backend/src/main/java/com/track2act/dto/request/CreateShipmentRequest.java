package com.track2act.dto.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateShipmentRequest {
    private String cargoType;
    private String originId;
    private String destinationId;
    private LocalDateTime estimatedArrival;
    private Double currentLatitude;
    private Double currentLongitude;
    private String driverName;
    private String driverContact;
}
