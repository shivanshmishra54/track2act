package com.track2act.controller;

import com.track2act.dto.response.ApiResponse;
import com.track2act.dto.response.UserDTO;
import com.track2act.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/me")
@Slf4j
public class MeControl {

    @GetMapping
    public ResponseEntity<ApiResponse> getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UserDTO userDTO = new UserDTO(
            userPrincipal.getId(),
            userPrincipal.getFullName(),
            userPrincipal.getEmail(),
            userPrincipal.getRole().name()
        );
        log.info("Me endpoint called for user: {}", userPrincipal.getEmail());
        return ResponseEntity.ok(ApiResponse.success("User fetched", userDTO));
    }
}
