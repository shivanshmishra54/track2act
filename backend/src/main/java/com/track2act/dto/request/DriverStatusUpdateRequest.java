package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class DriverStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    @Pattern(regexp = "^(IN_TRANSIT|DELIVERED|DELAYED)$", message = "Invalid driver status transition")
    private String status;

    private String notes;
    private String proofOfDeliveryUrl; // For delivered state
}
