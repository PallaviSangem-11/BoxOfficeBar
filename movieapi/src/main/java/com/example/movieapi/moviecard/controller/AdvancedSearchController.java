package com.example.movieapi.moviecard.controller;

import com.example.movieapi.moviecard.model.Card;
import com.example.movieapi.moviecard.service.AdvancedSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000")
public class AdvancedSearchController {

    @Autowired
    private AdvancedSearchService advancedSearchService;

    @GetMapping("/advanced")
    public ResponseEntity<Map<String, Object>> advancedSearch(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String cast,
            @RequestParam(required = false) String language) {
        
        Map<String, Object> results = advancedSearchService.search(query, genre, cast, language);
        return ResponseEntity.ok(results);
    }
} 