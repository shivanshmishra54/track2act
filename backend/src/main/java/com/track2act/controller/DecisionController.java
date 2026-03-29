package com.track2act.controller;

import com.track2act.dto.DecisionResponse;
import com.track2act.service.HuggingFaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/decisions")
@RequiredArgsConstructor
public class DecisionController {

    private final HuggingFaceService huggingFaceService;

    @GetMapping
    @PreAuthorize("hasRole('COMPANY_OFFICER')")
    public ResponseEntity<List<DecisionResponse>> getDecisions() {
        return ResponseEntity.ok(huggingFaceService.generateDecisions());
    }
}
