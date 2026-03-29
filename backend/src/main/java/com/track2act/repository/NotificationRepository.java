package com.track2act.repository;

import com.track2act.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(UUID recipientId);
    long countByRecipient_IdAndIsReadFalse(UUID recipientId);
}
