package com.track2act.controller;

import com.track2act.dto.response.ApiResponse;
import com.track2act.dto.response.NotificationDTO;
import com.track2act.entity.Notification;
import com.track2act.entity.User;
import com.track2act.repository.NotificationRepository;
import com.track2act.repository.UserRepository;
import com.track2act.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return userRepository.findById(UUID.fromString(principal.getId()))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getMyNotifications() {
        User me = getCurrentUser();
        List<Notification> notifs = notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(me.getId());
        
        List<NotificationDTO> dtoList = notifs.stream().map(n -> NotificationDTO.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched", dtoList));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id) {
        User me = getCurrentUser();
        Notification notif = notificationRepository.findById(id).orElseThrow(
            () -> new IllegalArgumentException("Notification not found")
        );
        
        if (!notif.getRecipient().getId().equals(me.getId())) {
             throw new IllegalStateException("Unauthorized to mark this notification");
        }
        
        notif.setRead(true);
        notificationRepository.save(notif);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
