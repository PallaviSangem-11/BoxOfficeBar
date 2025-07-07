package com.example.movieapi.moviecard.controller;

import com.example.movieapi.moviecard.model.Card;
import com.example.movieapi.moviecard.service.CardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend access
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping("/add")
    public ResponseEntity<Card> addCard(@RequestBody Card card) {
        Card savedCard = cardService.addCard(card);
        return ResponseEntity.ok(savedCard);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Card>> getAllCards() {
        List<Card> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        boolean isDeleted = cardService.deleteMovie(id);
        if (isDeleted) {
            return ResponseEntity.ok(Map.of("message", "Movie deleted successfully!"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Movie with ID " + id + " not found!"));
        }
    }
}
