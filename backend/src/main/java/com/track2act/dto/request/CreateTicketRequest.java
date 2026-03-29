package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class CreateTicketRequest {
    @NotNull(message = "Issue type goes missing")
    private String issueType;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    private UUID shipmentId; // Optional link to specific shipment
}
