package com.track2act.service;

import com.track2act.dto.request.RegisterRequest;
import com.track2act.dto.request.LoginRequest;
import com.track2act.dto.response.AuthResponse;
import com.track2act.dto.response.ApiResponse;
import com.track2act.entity.User;
import com.track2act.repository.UserRepository;
import com.track2act.security.JwtUtils;
import com.track2act.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ApiResponse.error(400, "Email already exists");
        }

        User user = User.builder()
                .id(java.util.UUID.randomUUID())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .isActive(true)
                .build();

        userRepository.save(user);

        // Generate token after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        String jwt = jwtUtils.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return ApiResponse.success("User registered successfully", response);
    }

    public ApiResponse<AuthResponse> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setUserId(java.util.UUID.fromString(userPrincipal.getId()));
        response.setFullName(userPrincipal.getFullName());
        response.setEmail(userPrincipal.getEmail());
        response.setRole(userPrincipal.getRole());

        return ApiResponse.success("Login successful", response);
    }
}

