package com.example.movieapi.moviecard.service;

import com.example.movieapi.moviecard.model.Card;
import com.example.movieapi.moviecard.repository.CardRepository;
import com.example.movieapi.moviedetail.model.MovieDetail;
import com.example.movieapi.moviedetail.repository.MovieDetailRepository;
import com.example.movieapi.review.model.Review;
import com.example.movieapi.review.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdvancedSearchService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private MovieDetailRepository movieDetailRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Map<String, Object> search(String query, String genre, String cast, String language) {
        Map<String, Object> results = new HashMap<>();
        Set<Card> uniqueCards = new HashSet<>();
        Set<MovieDetail> uniqueMovieDetails = new HashSet<>();

        String lowerCaseQuery = query != null ? query.toLowerCase() : "";

        // 1. Search in Card entity (title, languages)
        if (query != null && !query.isEmpty()) {
            cardRepository.findAll().stream()
                    .filter(card -> card.getTitle().toLowerCase().contains(lowerCaseQuery) ||
                                     (card.getLanguages() != null && card.getLanguages().toLowerCase().contains(lowerCaseQuery)))
                    .forEach(uniqueCards::add);
        }

        // 2. Search in MovieDetail entity (title, director, cast, genre)
        if (query != null && !query.isEmpty()) {
            movieDetailRepository.findByAllDetailsContainingIgnoreCase(lowerCaseQuery).stream()
                    .forEach(uniqueMovieDetails::add);
        }

        // 3. Search in Review entity (movieTitle, director, cast, reviewerName)
        if (query != null && !query.isEmpty()) {
            reviewRepository.findByMovieTitleContainingIgnoreCase(query).stream()
                    .forEach(review -> {
                        // Try to find a corresponding MovieDetail for the review's movieTitle
                        MovieDetail movieDetail = movieDetailRepository.findByTitleContainingIgnoreCase(review.getMovieTitle()).stream().findFirst().orElse(null);
                        if (movieDetail != null) {
                            uniqueMovieDetails.add(movieDetail);
                        }
                    });
        }

        // Combine results and map to Card for consistent output structure
        // Start with cards found directly from cardRepository
        List<Card> combinedResults = new ArrayList<>(uniqueCards);

        // Add movie details, convert to Card if not already present
        for (MovieDetail md : uniqueMovieDetails) {
            boolean found = combinedResults.stream().anyMatch(card -> card.getTitle().equalsIgnoreCase(md.getTitle()));
            if (!found) {
                combinedResults.add(mapMovieDetailToCard(md));
            }
        }

        // Apply filters if present
        List<Card> filteredResults = combinedResults.stream()
                .filter(card -> {
                    boolean matchesGenre = genre == null || genre.isEmpty() ||
                            (movieDetailRepository.findByTitleContainingIgnoreCase(card.getTitle()).stream()
                                    .anyMatch(md -> md.getGenre().stream().anyMatch(g -> g.toLowerCase().contains(genre.toLowerCase()))));

                    boolean matchesCast = cast == null || cast.isEmpty() ||
                            (movieDetailRepository.findByTitleContainingIgnoreCase(card.getTitle()).stream()
                                    .anyMatch(md -> md.getCast().stream().anyMatch(c -> c.toLowerCase().contains(cast.toLowerCase()))));

                    boolean matchesLanguage = language == null || language.isEmpty() ||
                                              (card.getLanguages() != null && card.getLanguages().toLowerCase().contains(language.toLowerCase()));
                    return matchesGenre && matchesCast && matchesLanguage;
                })
                .collect(Collectors.toList());

        // Categorize results
        Map<String, List<Card>> categorizedResults = new HashMap<>();

        categorizedResults.put("titleMatches", filteredResults.stream()
                .filter(card -> card.getTitle().toLowerCase().contains(lowerCaseQuery))
                .collect(Collectors.toList()));

        categorizedResults.put("languageMatches", filteredResults.stream()
                .filter(card -> card.getLanguages() != null && card.getLanguages().toLowerCase().contains(lowerCaseQuery))
                .collect(Collectors.toList()));

        categorizedResults.put("genreMatches", filteredResults.stream()
                .filter(card -> genre != null && !genre.isEmpty() &&
                        movieDetailRepository.findByTitleContainingIgnoreCase(card.getTitle()).stream()
                                .anyMatch(md -> md.getGenre().stream().anyMatch(g -> g.toLowerCase().contains(genre.toLowerCase()))))
                .collect(Collectors.toList()));

        categorizedResults.put("castMatches", filteredResults.stream()
                .filter(card -> cast != null && !cast.isEmpty() &&
                        movieDetailRepository.findByTitleContainingIgnoreCase(card.getTitle()).stream()
                                .anyMatch(md -> md.getCast().stream().anyMatch(c -> c.toLowerCase().contains(cast.toLowerCase()))))
                .collect(Collectors.toList()));

        results.put("results", categorizedResults);
        results.put("totalResults", filteredResults.size());

        return results;
    }

    private Card mapMovieDetailToCard(MovieDetail md) {
        // This is a simplified mapping. Adjust based on your actual Card model fields
        return new Card(
                md.getTitle(),
                md.getPosterUrl(),
                // You need to decide how to get languages if not directly in MovieDetail
                // For now, setting to empty string or null. You might need another query.
                "", 
                md.getRating(),
                md.getReleaseDate()
        );
    }

    private Card mapReviewToCard(Review review) {
        // This is a simplified mapping. Adjust based on your actual Card model fields
        return new Card(
                review.getMovieTitle(),
                null, // Image URL not in Review
                null, // Languages not in Review
                (double) review.getRating(),
                null // Release date not in Review
        );
    }
}