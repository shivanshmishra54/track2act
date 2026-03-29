package com.track2act.config;

import com.track2act.entity.Location;
import com.track2act.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder {

    private final LocationRepository locationRepository;

    @Bean
    public CommandLineRunner seedLocations() {
        return args -> {
            if (locationRepository.count() == 0) {
                log.info("Database is empty. Seeding initial Hub Locations...");
                
                Location jnpt = Location.builder()
                        .name("Mumbai Cargo Port (JNPT)")
                        .type(Location.Type.PORT)
                        .latitude(18.9482)
                        .longitude(72.9499)
                        .build();

                Location delhi = Location.builder()
                        .name("Delhi Logistics Hub")
                        .type(Location.Type.HUB)
                        .latitude(28.6139)
                        .longitude(77.2090)
                        .build();

                Location chennai = Location.builder()
                        .name("Chennai Freight Terminal")
                        .type(Location.Type.PORT)
                        .latitude(13.0827)
                        .longitude(80.2707)
                        .build();
                        
                Location bangalore = Location.builder()
                        .name("Bangalore Tech Hub")
                        .type(Location.Type.HUB)
                        .latitude(12.9716)
                        .longitude(77.5946)
                        .build();

                locationRepository.saveAll(List.of(jnpt, delhi, chennai, bangalore));
                log.info("Successfully seeded standard Hub Locations.");
            }
        };
    }
}
