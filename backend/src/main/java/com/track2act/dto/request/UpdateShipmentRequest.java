package com.track2act.dto.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UpdateShipmentRequest {

    private String cargoType;
    private Double cargoWeight;
    private String cargoDescription;
    private UUID originId;
    private UUID destinationId;
    private UUID assignedDriverId;
    private String customerName;
    private String customerContact;
    private String receiverName;
    private String receiverContact;
    private LocalDateTime estimatedArrival;
    private String status;
}
