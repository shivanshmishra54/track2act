package com.track2act.repository;

import com.track2act.entity.TrackingUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface TrackingUpdateRepository extends JpaRepository<TrackingUpdate, UUID> {
    
    @Query("SELECT t FROM TrackingUpdate t WHERE t.shipment.id = :shipmentId ORDER BY t.timestamp DESC")
    List<TrackingUpdate> findByShipment_IdOrderByTimestampDesc(@Param("shipmentId") UUID shipmentId);
}
