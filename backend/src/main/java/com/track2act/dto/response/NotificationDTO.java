package com.track2act.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NotificationDTO {
    private UUID id;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
}
