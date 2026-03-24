package com.track2act.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {

    private UUID id;
    private String name;
    private LocationType type;
    private Double latitude;
    private Double longitude;

    public enum LocationType {
        PORT, HUB
    }
}
