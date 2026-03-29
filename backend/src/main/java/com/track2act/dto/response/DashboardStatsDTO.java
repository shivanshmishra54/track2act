package com.track2act.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private Long totalShipments;
    private Long activeShipments;
    private Long deliveredShipments;
    private Long delayedShipments;
}
