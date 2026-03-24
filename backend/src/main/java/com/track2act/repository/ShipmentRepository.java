package com.track2act.repository;

import com.track2act.entity.Shipment;
import com.track2act.entity.Shipment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {
    List<Shipment> findByStatusIn(List<Status> statuses);
    // Active shipments: ON_TIME, DELAYED, AT_RISK
    default List<Shipment> findActiveShipments() {
        return findByStatusIn(List.of(Status.ON_TIME, Status.DELAYED, Status.AT_RISK));
    }
}
