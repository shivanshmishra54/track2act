package com.track2act.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingUpdateDTO {

    private UUID id;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private String statusNote;
}
