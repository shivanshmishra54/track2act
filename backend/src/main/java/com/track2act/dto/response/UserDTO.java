package com.track2act.dto.response;

import com.track2act.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String fullName;
    private String email;
    private String role;

    public static UserDTO fromUserPrincipal(com.track2act.security.UserPrincipal principal) {
        return new UserDTO(
            principal.getId(),
            principal.getFullName(),
            principal.getEmail(),
            principal.getRole().name()
        );
    }
}
