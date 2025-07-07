package com.example.movieapi.moviecard.service;

import com.example.movieapi.moviecard.model.Card;
import com.example.movieapi.moviecard.repository.CardRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {
    private final CardRepository cardRepository;

    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public Card addCard(Card card) {
        return cardRepository.save(card);
    }

    @Transactional
    public boolean deleteMovie(Long id) {
        if (!cardRepository.existsById(id)) {
            return false;
        }
        
        cardRepository.deleteById(id);

        // Reset auto-increment ID only if no records exist
        if (cardRepository.count() == 0) {
            cardRepository.resetAutoIncrement();
        }

        return true;
    }

    public Optional<Card> getCardById(Long id) {
        return cardRepository.findById(id);
    }
}
