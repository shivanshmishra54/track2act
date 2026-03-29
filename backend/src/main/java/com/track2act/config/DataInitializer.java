package com.track2act.config;

import com.track2act.entity.User;
import com.track2act.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.UUID;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner initializeAdminUser() {
        return args -> {
            String adminEmail = "shivansh@admin.com";
            
            // Check if admin already exists
            if (userRepository.findByEmail(adminEmail).isPresent()) {
                log.info("Admin user already exists: {}", adminEmail);
                return;
            }

            // Create admin user
            User adminUser = User.builder()
                    .id(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"))
                    .fullName("Shivansh")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("9820689183"))
                    .role(User.Role.ADMIN)
                    .isActive(true)
                    .build();

            userRepository.save(adminUser);
            log.info("Admin user created successfully - Email: {}", adminEmail);
        };
    }
}
