package com.example.movieapi.review.service;

import com.example.movieapi.review.model.Review;

import com.example.movieapi.review.model.ReviewVote;
import com.example.movieapi.review.repository.ReviewRepository;
import com.example.movieapi.review.repository.ReviewVoteRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    private final ReviewRepository reviewRepository;
    private final ReviewVoteRepository reviewVoteRepository;

    public ReviewService(ReviewRepository reviewRepository, ReviewVoteRepository reviewVoteRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewVoteRepository = reviewVoteRepository;
    }

    public Review submitReview(Review review) {
        if (review == null) {
            throw new IllegalArgumentException("Review cannot be null");
        }

        // Prevent duplicate review by same user for a movie
        if (reviewRepository.existsByEmailAndMovieTitle(review.getEmail(), review.getMovieTitle())) {
            throw new IllegalStateException("User has already reviewed this movie");
        }

        review.setCreatedAt(LocalDateTime.now());
        review.setHelpfulVotes(0);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new IllegalArgumentException("Search keyword cannot be null or empty");
        }
        List<Review> reviews = reviewRepository.searchReviews(keyword);
        setHelpfulStatus(reviews);
        return reviews;
    }

    public List<Review> getReviewsByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        List<Review> reviews = reviewRepository.findByEmail(email);
        setHelpfulStatus(reviews);
        return reviews;
    }

    public List<Review> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        setHelpfulStatus(reviews);
        return reviews;
    }

    private void setHelpfulStatus(List<Review> reviews) {
        try {
            // Get the current request from RequestContextHolder
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String userEmail = request.getHeader("User-Email");
                if (userEmail != null && !userEmail.trim().isEmpty()) {
                    for (Review review : reviews) {
                        Optional<ReviewVote> vote = reviewVoteRepository.findByReviewIdAndUserEmail(review.getId(), userEmail);
                        review.setIsHelpful(vote.map(ReviewVote::isHelpful).orElse(false));
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Error setting helpful status", e);
        }
    }

    private String getCurrentUserEmail() {
        try {
            // Get the current request from RequestContextHolder
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String userEmail = request.getHeader("User-Email");
                if (userEmail != null && !userEmail.trim().isEmpty()) {
                    return userEmail.trim();
                }
            }
        } catch (Exception e) {
            logger.warn("Error getting current user email", e);
        }
        return null;
    }

    @Transactional
    public Map<String, Object> toggleHelpfulVote(Long reviewId, String userEmail) {
        logger.info("Toggling vote for review: {} by user: {}", reviewId, userEmail);
        
        if (reviewId == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (userEmail == null || userEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalStateException("Review not found with ID: " + reviewId));

        Optional<ReviewVote> existingVote = reviewVoteRepository.findByReviewIdAndUserEmail(reviewId, userEmail);
        ReviewVote vote;

        if (existingVote.isPresent()) {
            vote = existingVote.get();
            logger.info("Found existing vote: {}, current state: {}", vote.getId(), vote.isHelpful());
            vote.setHelpful(!vote.isHelpful());
            logger.info("Toggled vote to: {}", vote.isHelpful());
        } else {
            vote = new ReviewVote();
            vote.setReview(review);
            vote.setUserEmail(userEmail);
            vote.setHelpful(true);
            logger.info("Created new vote for review: {}", reviewId);
        }

        reviewVoteRepository.save(vote);
        logger.info("Saved vote: {}", vote.getId());
        
        long helpfulCount = reviewVoteRepository.countByReviewIdAndIsHelpfulTrue(reviewId);
        logger.info("Updated helpful count to: {}", helpfulCount);
        
        review.setHelpfulVotes((int) helpfulCount);
        reviewRepository.save(review);

        Map<String, Object> response = new HashMap<>();
        response.put("helpfulCount", helpfulCount);
        response.put("isHelpful", vote.isHelpful());
        logger.info("Returning response: {}", response);
        return response;
    }
}
