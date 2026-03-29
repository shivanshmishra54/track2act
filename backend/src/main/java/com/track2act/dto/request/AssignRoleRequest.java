package com.track2act.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class AssignRoleRequest {

    @NotNull(message = "Role is required")
    private String role;

    private String phoneNumber;
    private String address;
    private String companyName;
}
