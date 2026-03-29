package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ReplyTicketRequest {
    @NotBlank(message = "Message cannot be empty")
    private String content;
}
