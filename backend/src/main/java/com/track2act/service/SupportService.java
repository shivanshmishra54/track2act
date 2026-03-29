package com.track2act.service;

import com.track2act.dto.request.CreateTicketRequest;
import com.track2act.dto.request.ReplyTicketRequest;
import com.track2act.dto.response.SupportTicketDTO;
import com.track2act.dto.response.TicketMessageDTO;
import com.track2act.entity.SupportTicket;
import com.track2act.entity.TicketMessage;
import com.track2act.entity.User;
import com.track2act.repository.SupportTicketRepository;
import com.track2act.repository.TicketMessageRepository;
import com.track2act.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportService {

    private final SupportTicketRepository supportTicketRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }

    public List<SupportTicketDTO> getMyTickets() {
        User user = getCurrentUser();
        return supportTicketRepository.findByCustomer_IdOrderByCreatedAtDesc(user.getId())
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public SupportTicketDTO createTicket(CreateTicketRequest request) {
        User user = getCurrentUser();
        
        SupportTicket ticket = SupportTicket.builder()
                .customer(user)
                .shipmentId(request.getShipmentId())
                .issueType(SupportTicket.IssueType.valueOf(request.getIssueType()))
                .status(SupportTicket.Status.OPEN)
                .description(request.getDescription())
                .build();
                
        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        
        // Save initial description as a message for the thread
        TicketMessage initialMessage = TicketMessage.builder()
                .ticket(savedTicket)
                .sender(user)
                .content(request.getDescription())
                .isAdminReply(false)
                .build();
        ticketMessageRepository.save(initialMessage);
        
        return getTicketDetails(savedTicket.getId());
    }

    public SupportTicketDTO getTicketDetails(UUID ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        
        User user = getCurrentUser();
        // Ensure customer can only view their own tickets. Admins bypass.
        if (user.getRole() == User.Role.CUSTOMER && !ticket.getCustomer().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to view this ticket");
        }
        
        return toDTO(ticket);
    }

    @Transactional
    public SupportTicketDTO replyToTicket(UUID ticketId, ReplyTicketRequest request) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
                
        User user = getCurrentUser();
        boolean isAdmin = user.getRole() != User.Role.CUSTOMER && user.getRole() != User.Role.DRIVER;
        
        if (!isAdmin && !ticket.getCustomer().getId().equals(user.getId())) {
             throw new IllegalStateException("Not authorized to reply to this ticket");
        }
        
        TicketMessage reply = TicketMessage.builder()
                .ticket(ticket)
                .sender(user)
                .content(request.getContent())
                .isAdminReply(isAdmin)
                .build();
                
        ticketMessageRepository.save(reply);
        
        // If customer replies, it might re-open a resolved ticket.
        if (!isAdmin && ticket.getStatus() == SupportTicket.Status.RESOLVED) {
            ticket.setStatus(SupportTicket.Status.OPEN);
            supportTicketRepository.save(ticket);
        } else if (isAdmin && ticket.getStatus() == SupportTicket.Status.OPEN) {
            ticket.setStatus(SupportTicket.Status.IN_PROGRESS);
            supportTicketRepository.save(ticket);
        }
        
        return getTicketDetails(ticketId);
    }

    private SupportTicketDTO toDTO(SupportTicket ticket) {
        List<TicketMessageDTO> msgDTOs = ticket.getMessages().stream()
                .map(m -> new TicketMessageDTO(m.getId(), m.getSender().getId(), m.getSender().getFullName(), m.getContent(), m.isAdminReply(), m.getSentAt()))
                .collect(Collectors.toList());
                
        return new SupportTicketDTO(
                ticket.getId(),
                ticket.getCustomer().getId(),
                ticket.getCustomer().getFullName(),
                ticket.getShipmentId(),
                ticket.getIssueType().name(),
                ticket.getStatus().name(),
                ticket.getDescription(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                msgDTOs
        );
    }
}
