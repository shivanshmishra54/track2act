package com.track2act.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.track2act.dto.DecisionResponse;
import com.track2act.dto.DecisionOptionDTO;
import com.track2act.dto.DecisionImpactDTO;
import com.track2act.dto.DecisionGuardrailDTO;
import com.track2act.entity.Shipment;
import com.track2act.repository.ShipmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class HuggingFaceService {

    @Value("${huggingface.api-key}")
    private String apiKey;

    @Value("${huggingface.api-url}")
    private String apiUrl;

    private final ShipmentRepository shipmentRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public HuggingFaceService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public List<DecisionResponse> generateDecisions() {
        try {
            List<Shipment> activeShipments = shipmentRepository.findAll().stream()
                .filter(s -> s.getStatus() == Shipment.Status.IN_TRANSIT || s.getStatus() == Shipment.Status.DELAYED || s.getStatus() == Shipment.Status.AT_RISK)
                .collect(Collectors.toList());

            if (activeShipments.isEmpty()) {
                return fallbackMockData();
            }

            // Take up to 3 shipments to avoid exceeding token limits
            List<Shipment> sampleShipments = activeShipments.subList(0, Math.min(3, activeShipments.size()));

            String contextData = sampleShipments.stream().map(s -> {
                String origin = s.getOrigin() != null ? s.getOrigin().getName() : "Unknown";
                String dest = s.getDestination() != null ? s.getDestination().getName() : "Unknown";
                return String.format("Shipment %s (Cargo: %s) from %s to %s, Status: %s.",
                        s.getTrackingNumber(), s.getCargoType(), origin, dest, s.getStatus()
                );
            }).collect(Collectors.joining("\n"));

            String prompt = "<s>[INST] You are an AI Logistics decision engine. Create 2 realistic supply chain decision recommendations based on this real data:\n" +
                    contextData + "\n\n" +
                    "Return ONLY valid JSON array with objects matching this strict format:\n" +
                    "[{ \"id\": \"DEC-001\", \"title\": \"...\", \"context\": \"...\", \"shipmentId\": \"...\", \"urgency\": \"high|medium|low\", \"status\": \"pending\", \"timestamp\": \"Just now\", \"aiAnalysis\": \"...\", \"options\": [{ \"id\": \"opt-1\", \"title\": \"...\", \"description\": \"...\", \"impact\": { \"cost\": \"...\", \"delay\": \"...\", \"risk\": \"Low|Medium|High\" }, \"pros\": [\"...\"], \"cons\": [\"...\"], \"confidence\": 90, \"recommended\": true}], \"guardrails\": [{\"rule\": \"...\", \"status\": \"pass|warn|fail\"}] }]\n" +
                    "Respond with NOTHING but the raw JSON array. Do not use markdown code blocks like ```json. [/INST]";

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("inputs", prompt);
            
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("return_full_text", false);
            parameters.put("max_new_tokens", 1024);
            parameters.put("temperature", 0.3);
            requestBody.put("parameters", parameters);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // HF returns an array with "generated_text"
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                String generatedText = "";
                if (rootNode.isArray() && rootNode.size() > 0) {
                    JsonNode textNode = rootNode.get(0).get("generated_text");
                    if(textNode != null) {
                        generatedText = textNode.asText().trim();
                    }
                } else {
                    generatedText = response.getBody().trim(); // fallback if HF returns direct string
                }
                
                // Cleanup generated text
                if (generatedText.startsWith("```json")) {
                    generatedText = generatedText.substring(7);
                }
                if (generatedText.startsWith("```")) {
                    generatedText = generatedText.substring(3);
                }
                if (generatedText.endsWith("```")) {
                    generatedText = generatedText.substring(0, generatedText.length() - 3);
                }
                generatedText = generatedText.trim();

                try {
                    return objectMapper.readValue(generatedText, new TypeReference<List<DecisionResponse>>() {});
                } catch (Exception e) {
                    log.error("Failed to parse HF Response as JSON", e);
                    return fallbackMockData();
                }
            } else {
                log.warn("HF API returned non-2xx status code");
                return fallbackMockData();
            }

        } catch (Exception e) {
            log.error("Error generating decisions from Hugging Face", e);
            return fallbackMockData();
        }
    }

    private List<DecisionResponse> fallbackMockData() {
        return List.of(
            DecisionResponse.builder()
                .id("DEC-FALLBACK")
                .title("Inventory Reallocation (Fallback System)")
                .context("Using rules-based fallback due to AI service unavailability.")
                .shipmentId("SYS-000")
                .urgency("low")
                .status("pending")
                .timestamp("Just now")
                .aiAnalysis("Hugging Face API is currently unavailable or returning unparseable format. Relying on simple rule heuristics.")
                .options(List.of(
                    DecisionOptionDTO.builder()
                        .id("opt-fallback-1")
                        .title("Wait & Monitor")
                        .description("Take no action and wait for API to recover")
                        .impact(DecisionImpactDTO.builder().cost("0").delay("0").risk("Low").build())
                        .pros(List.of("No immediate cost"))
                        .cons(List.of("Ignores potential delays"))
                        .confidence(100)
                        .recommended(true)
                        .build()
                ))
                .guardrails(List.of(
                    DecisionGuardrailDTO.builder().rule("API Accessibility").status("fail").build()
                ))
                .build()
        );
    }
}
