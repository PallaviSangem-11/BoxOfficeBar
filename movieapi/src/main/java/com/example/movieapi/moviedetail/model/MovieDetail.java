package com.example.movieapi.moviedetail.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "moviesdetails")
public class MovieDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String posterUrl;
    private String releaseDate;
    private String synopsis;
    private double rating;
    private String director;
    private String language;

    @ElementCollection
    @CollectionTable(name = "movie_cast", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "cast_member")
    private List<String> cast;

    @ElementCollection
    @CollectionTable(name = "movie_genre", joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "genre_name")
    private List<String> genre;

    // Constructors
    public MovieDetail() {}

    public MovieDetail(String title, String posterUrl, String releaseDate, String synopsis, double rating, String director, String language, List<String> cast, List<String> genre) {
        this.title = title;
        this.posterUrl = posterUrl;
        this.releaseDate = releaseDate;
        this.synopsis = synopsis;
        this.rating = rating;
        this.director = director;
        this.language = language;
        this.cast = cast;
        this.genre = genre;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public List<String> getGenre() { return genre; }
    public void setGenre(List<String> genre) { this.genre = genre; }
}

