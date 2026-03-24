package com.track2act.repository;

import com.track2act.entity.TrackingUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TrackingUpdateRepository extends JpaRepository<TrackingUpdate, UUID> {
}
