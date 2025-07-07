package com.example.movieapi.controller;

import com.example.movieapi.entity.User;
import com.example.movieapi.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoritesController {

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleFavorite(@RequestBody Map<String, Object> request) {
        String email = (String) request.get("email");
        Long movieId = Long.valueOf(request.get("movieId").toString());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> favorites = new ArrayList<>();
        try {
            favorites = objectMapper.readValue(user.getFavorites(), new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            // If favorites is empty or invalid JSON, start with empty list
        }

        boolean isFavorite = favorites.contains(movieId);
        if (isFavorite) {
            favorites.remove(movieId);
        } else {
            favorites.add(movieId);
        }

        try {
            user.setFavorites(objectMapper.writeValueAsString(favorites));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("favorited", !isFavorite));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update favorites");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getFavoriteStatus(
            @RequestParam String email,
            @RequestParam Long movieId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> favorites = new ArrayList<>();
        try {
            favorites = objectMapper.readValue(user.getFavorites(), new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            // If favorites is empty or invalid JSON, return false
        }

        boolean isFavorite = favorites.contains(movieId);
        return ResponseEntity.ok(Map.of("favorited", isFavorite));
    }

    @GetMapping("/list")
    public ResponseEntity<?> getFavorites(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Long> favorites = new ArrayList<>();
        try {
            favorites = objectMapper.readValue(user.getFavorites(), new TypeReference<List<Long>>() {});
        } catch (Exception e) {
            // If favorites is empty or invalid JSON, return empty list
        }

        return ResponseEntity.ok(favorites);
    }
} 