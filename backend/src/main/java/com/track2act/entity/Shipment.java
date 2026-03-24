package com.track2act.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    public enum Status {
        ON_TIME, DELAYED, AT_RISK
    }

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "cargo_type", nullable = false)
    private String cargoType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ON_TIME;

    @Column(name = "current_progress")
    private Integer currentProgress = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_id")
    private Location origin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id")
    private Location destination;

    @Column(name = "estimated_arrival")
    private LocalDateTime estimatedArrival;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "driver_name")
    private String driverName;

    @Column(name = "driver_contact")
    private String driverContact;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackingUpdate> trackingUpdates = List.of();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
