package com.track2act.repository;

import com.track2act.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    List<Location> findByType(Location.Type type);
    Optional<Location> findByName(String name);
}
