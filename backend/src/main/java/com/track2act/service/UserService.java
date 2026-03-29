package com.track2act.service;

import com.track2act.dto.request.AssignRoleRequest;
import com.track2act.dto.response.UserDTO;
import com.track2act.entity.User;
import com.track2act.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getUsersByRole(String role) {
        try {
            User.Role userRole = User.Role.valueOf(role);
            return userRepository.findByRole(userRole).stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        return UserDTO.fromUser(user);
    }

    public UserDTO assignRole(UUID userId, AssignRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        try {
            User.Role role = User.Role.valueOf(request.getRole());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role: " + request.getRole());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCompanyName() != null) {
            user.setCompanyName(request.getCompanyName());
        }

        User updated = userRepository.save(user);
        log.info("Assigned role {} to user: {}", request.getRole(), userId);
        return UserDTO.fromUser(updated);
    }

    public UserDTO updateUser(UUID userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (userDTO.getFullName() != null) user.setFullName(userDTO.getFullName());
        if (userDTO.getPhoneNumber() != null) user.setPhoneNumber(userDTO.getPhoneNumber());
        if (userDTO.getAddress() != null) user.setAddress(userDTO.getAddress());
        if (userDTO.getCompanyName() != null) user.setCompanyName(userDTO.getCompanyName());

        User updated = userRepository.save(user);
        log.info("Updated user: {}", userId);
        return UserDTO.fromUser(updated);
    }

    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setIsActive(false);
        userRepository.save(user);
        log.info("Deactivated user: {}", userId);
    }

    public void activateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setIsActive(true);
        userRepository.save(user);
        log.info("Activated user: {}", userId);
    }
}
