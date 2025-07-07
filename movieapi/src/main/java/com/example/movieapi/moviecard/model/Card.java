package com.example.movieapi.moviecard.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cards") // Ensure it matches your table name
public class Card {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;
    
    private String title;
    private String image_url;
    private String languages;
    private Double rating;
    private String release_date;

    // Constructors
    public Card() {}

    public Card(String title, String image_url, String languages, Double rating, String release_date) {
        this.title = title;
        this.image_url = image_url;
        this.languages = languages;
        this.rating = rating;
        this.release_date = release_date;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getRelease_date() {
        return release_date;
    }

    public void setRelease_date(String release_date) {
        this.release_date = release_date;
    }
}
