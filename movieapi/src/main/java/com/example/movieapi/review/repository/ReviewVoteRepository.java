package com.example.movieapi.review.repository;

import com.example.movieapi.review.model.ReviewVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewVoteRepository extends JpaRepository<ReviewVote, Long> {
    Optional<ReviewVote> findByReviewIdAndUserEmail(Long reviewId, String userEmail);
    long countByReviewIdAndIsHelpfulTrue(Long reviewId);
} 