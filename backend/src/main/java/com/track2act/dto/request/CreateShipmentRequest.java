package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateShipmentRequest {
    
    @NotBlank(message = "Cargo type is required")
    private String cargoType;

    private Double cargoWeight;

    private String cargoDescription;

    @NotNull(message = "Origin location ID is required")
    private UUID originId;

    @NotNull(message = "Destination location ID is required")
    private UUID destinationId;

    private UUID assignedDriverId;

    @NotNull(message = "Customer name is required")
    private String customerName;

    @NotNull(message = "Customer contact is required")
    private String customerContact;

    @NotNull(message = "Receiver name is required")
    private String receiverName;

    @NotNull(message = "Receiver contact is required")
    private String receiverContact;

    @NotNull(message = "Estimated arrival is required")
    private LocalDateTime estimatedArrival;
}
