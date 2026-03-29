package com.track2act.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DecisionOptionDTO {
    private String id;
    private String title;
    private String description;
    private DecisionImpactDTO impact;
    private List<String> pros;
    private List<String> cons;
    private Integer confidence;
    private Boolean recommended;
}
