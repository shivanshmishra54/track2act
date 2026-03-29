package com.track2act.dto.response;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class TicketMessageDTO {
    private UUID id;
    private UUID senderId;
    private String senderName;
    private String content;
    private boolean isAdminReply;
    private LocalDateTime sentAt;
}
