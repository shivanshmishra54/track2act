package com.track2act.controller;

import com.track2act.dto.request.CreateTicketRequest;
import com.track2act.dto.request.ReplyTicketRequest;
import com.track2act.dto.response.ApiResponse;
import com.track2act.dto.response.SupportTicketDTO;
import com.track2act.service.SupportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SupportController {

    private final SupportService supportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SupportTicketDTO>>> getTickets() {
        return ResponseEntity.ok(ApiResponse.success("Tickets retrieved", supportService.getMyTickets()));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<SupportTicketDTO>> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Ticket created", supportService.createTicket(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<SupportTicketDTO>> getTicketDetails(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Ticket details retrieved", supportService.getTicketDetails(id)));
    }

    @PostMapping("/{id}/reply")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<SupportTicketDTO>> replyToTicket(
            @PathVariable UUID id, 
            @Valid @RequestBody ReplyTicketRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Reply added", supportService.replyToTicket(id, request)));
    }
}
