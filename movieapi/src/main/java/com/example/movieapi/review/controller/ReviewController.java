package com.example.movieapi.review.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.movieapi.review.model.Review;
import com.example.movieapi.review.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        try {
            if (review == null) {
                return ResponseEntity.badRequest().body("Review cannot be null");
            }
            Review savedReview = reviewService.submitReview(review);
            return ResponseEntity.ok(savedReview);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error submitting review", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @GetMapping
    public ResponseEntity<?> getReviews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String email,
            @RequestHeader(value = "User-Email", required = false) String userEmail) {
        try {
            logger.info("Fetching reviews with keyword: {}, email: {}, userEmail: {}", keyword, email, userEmail);
            List<Review> reviews;
            if (keyword != null) {
                reviews = reviewService.getReviewsByKeyword(keyword);
            } else if (email != null) {
                reviews = reviewService.getReviewsByEmail(email);
            } else {
                reviews = reviewService.getAllReviews();
            }
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid request parameters", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Error fetching reviews", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }

    @PostMapping("/{reviewId}/vote/toggle")
    public ResponseEntity<?> toggleHelpfulVote(
            @PathVariable Long reviewId,
            @RequestHeader("User-Email") String userEmail) {
        try {
            logger.info("Received vote toggle request for review: {} by user: {}", reviewId, userEmail);
            
            if (reviewId == null) {
                return ResponseEntity.badRequest().body("Review ID cannot be null");
            }
            if (userEmail == null || userEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("User email is required");
            }

            Map<String, Object> result = reviewService.toggleHelpfulVote(reviewId, userEmail);
            logger.info("Vote toggle successful. Result: {}", result);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Error toggling vote", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error toggling vote", e);
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
}
