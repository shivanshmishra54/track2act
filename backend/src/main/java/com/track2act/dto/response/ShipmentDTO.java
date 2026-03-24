package com.track2act.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDTO {

    private UUID id;
    private String cargoType;
    private String status; // "ON_TIME", "DELAYED", "AT_RISK"
    private Integer currentProgress;
    private String originName;
    private String destinationName;
    private LocalDateTime estimatedArrival;
    private Double currentLatitude;
    private Double currentLongitude;
    private String driverName;
}
