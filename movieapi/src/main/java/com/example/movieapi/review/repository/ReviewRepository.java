package com.example.movieapi.review.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.movieapi.review.model.Review;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE " +
           "LOWER(r.movieTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.director) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.cast) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.reviewerName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Review> searchReviews(@Param("keyword") String keyword);

    List<Review> findByEmail(String email);

    boolean existsByEmailAndMovieTitle(String email, String movieTitle);

    Optional<Review> findById(Long id);

    // ✅ NEW METHOD
    List<Review> findByMovieTitleContainingIgnoreCase(String movieTitle);
}
