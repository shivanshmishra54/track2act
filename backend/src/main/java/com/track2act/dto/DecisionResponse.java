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
public class DecisionResponse {
    private String id;
    private String title;
    private String context;
    private String shipmentId;
    private String urgency;
    private String status;
    private String timestamp;
    private String aiAnalysis;
    private List<DecisionOptionDTO> options;
    private List<DecisionGuardrailDTO> guardrails;
}
