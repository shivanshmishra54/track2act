package com.track2act.dto.response;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Data
@AllArgsConstructor
public class SupportTicketDTO {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private UUID shipmentId;
    private String issueType;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TicketMessageDTO> messages;
}
