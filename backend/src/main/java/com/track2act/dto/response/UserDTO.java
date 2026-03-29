package com.track2act.dto.response;

import com.track2act.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String role;
    private String phoneNumber;
    private String address;
    private String companyName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .phoneNumber(user.getPhoneNumber())
            .address(user.getAddress())
            .companyName(user.getCompanyName())
            .isActive(user.getIsActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    public static UserDTO fromUserPrincipal(com.track2act.security.UserPrincipal principal) {
        return UserDTO.builder()
            .id(UUID.fromString(principal.getId()))
            .fullName(principal.getFullName())
            .email(principal.getEmail())
            .role(principal.getRole().name())
            .build();
    }
}
