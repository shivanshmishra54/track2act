package com.track2act.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.track2act.entity.Shipment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentDTO {

    private UUID id;
    private String trackingNumber;
    private String cargoType;
    private Double cargoWeight;
    private String cargoDescription;
    private String status;
    private Integer currentProgress;
    private String originName;
    private String destinationName;
    private LocalDateTime estimatedArrival;
    private Double currentLatitude;
    private Double currentLongitude;
    private UUID assignedDriverId;
    private String assignedDriverName;
    private String customerName;
    private String customerContact;
    private String receiverName;
    private String receiverContact;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TrackingUpdateDTO> trackingHistory;
    
    private String statusColor;
    
    public String getStatusColor() {
        return switch (this.status) {
            case "PENDING" -> "amber";
            case "IN_TRANSIT" -> "blue";
            case "DELIVERED" -> "green";
            default -> "gray";
        };
    }
}
