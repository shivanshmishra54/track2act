package com.track2act.service;

import com.track2act.dto.request.CreateShipmentRequest;
import com.track2act.dto.response.ShipmentDTO;
import com.track2act.entity.Location;
import com.track2act.entity.Shipment;
import com.track2act.repository.LocationRepository;
import com.track2act.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final LocationRepository locationRepository;

    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public Integer computeProgress(Shipment shipment) {
        if (shipment.getOrigin() == null || shipment.getCurrentLatitude() == null || shipment.getCurrentLongitude() == null) {
            return 0;
        }
        Location origin = shipment.getOrigin();
        double distTotal = haversine(origin.getLatitude(), origin.getLongitude(),
                shipment.getDestination().getLatitude(), shipment.getDestination().getLongitude());
        if (distTotal == 0) return 0;
        double distCurrent = haversine(origin.getLatitude(), origin.getLongitude(),
                shipment.getCurrentLatitude(), shipment.getCurrentLongitude());
        double progress = (distCurrent / distTotal) * 100;
        return (int) Math.min(100, Math.max(0, progress));
    }

    public List<ShipmentDTO> getActiveShipments() {
        List<Shipment> active = shipmentRepository.findActiveShipments();
        return active.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ShipmentDTO getById(UUID id) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment not found: " + id));
        return toDTO(shipment);
    }

    public ShipmentDTO create(CreateShipmentRequest request) {
        UUID originId = UUID.fromString(request.getOriginId());
        UUID destId = UUID.fromString(request.getDestinationId());
        Location origin = locationRepository.findById(originId).orElseThrow(() -> new IllegalArgumentException("Origin not found"));
        Location dest = locationRepository.findById(destId).orElseThrow(() -> new IllegalArgumentException("Destination not found"));

        Shipment shipment = Shipment.builder()
                .cargoType(request.getCargoType())
                .origin(origin)
                .destination(dest)
                .estimatedArrival(request.getEstimatedArrival())
                .currentLatitude(request.getCurrentLatitude())
                .currentLongitude(request.getCurrentLongitude())
                .driverName(request.getDriverName())
                .driverContact(request.getDriverContact())
                .build();

        shipment.setCurrentProgress(computeProgress(shipment));

        Shipment saved = shipmentRepository.save(shipment);
        log.info("Created shipment: {}", saved.getId());
        return toDTO(saved);
    }

    private ShipmentDTO toDTO(Shipment s) {
return new ShipmentDTO(s.getId(), s.getCargoType(), s.getStatus().name(), s.getCurrentProgress(), s.getOrigin().getName(), s.getDestination().getName(), s.getEstimatedArrival(), s.getCurrentLatitude(), s.getCurrentLongitude(), s.getDriverName());
    }

    public List<com.track2act.dto.response.LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream().map(l -> new com.track2act.dto.response.LocationDTO(l.getId(), l.getName(), com.track2act.dto.response.LocationDTO.LocationType.valueOf(l.getType().name()), l.getLatitude(), l.getLongitude())).collect(Collectors.toList());
    }
}
