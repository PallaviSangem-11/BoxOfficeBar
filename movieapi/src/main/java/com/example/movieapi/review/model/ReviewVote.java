package com.example.movieapi.review.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"review_id", "user_email"}, name = "unique_review_vote")
})
public class ReviewVote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "is_helpful", nullable = false)
    private boolean isHelpful;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ReviewVote() {
        this.createdAt = LocalDateTime.now();
        this.isHelpful = true; // Default to true for new votes
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public boolean isHelpful() {
        return isHelpful;
    }

    public void setHelpful(boolean helpful) {
        isHelpful = helpful;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 