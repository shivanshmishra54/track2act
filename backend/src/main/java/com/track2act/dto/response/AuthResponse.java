package com.track2act.dto.response;

import com.track2act.entity.User.Role;
import lombok.Data;
import java.util.UUID;

@Data
public class AuthResponse {
    private String token;
    private UUID userId;
    private String fullName;
    private String email;
    private Role role;
}

