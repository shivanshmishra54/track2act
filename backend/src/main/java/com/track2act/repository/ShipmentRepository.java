package com.track2act.repository;

import com.track2act.entity.Shipment;
import com.track2act.entity.Shipment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {
    
    List<Shipment> findByStatusIn(List<Status> statuses);
    
    List<Shipment> findByCustomerName(String customerName);

    List<Shipment> findByAssignedDriver_Id(UUID driverId);
    
    List<Shipment> findByCreatedBy_Id(UUID creatorId);
    
    @Query("SELECT s FROM Shipment s WHERE s.status IN ('IN_TRANSIT', 'PENDING', 'DELAYED')")
    List<Shipment> findActiveShipments();
    
    @Query("SELECT s FROM Shipment s WHERE s.trackingNumber = :trackingNumber")
    Optional<Shipment> findByTrackingNumber(@Param("trackingNumber") String trackingNumber);

    long count();

    long countByStatus(Status status);
}
