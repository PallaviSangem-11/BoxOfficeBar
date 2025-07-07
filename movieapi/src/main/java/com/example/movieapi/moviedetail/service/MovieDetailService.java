package com.example.movieapi.moviedetail.service;

import com.example.movieapi.moviedetail.model.MovieDetail;
import com.example.movieapi.moviedetail.repository.MovieDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MovieDetailService {

    @Autowired
    private MovieDetailRepository movieDetailRepository; // Fixed repository name

    @Transactional
    public MovieDetail addMovie(MovieDetail movie) {
        System.out.println("Saving movie: " + movie.getTitle());
        System.out.println("Cast: " + movie.getCast());
        System.out.println("Genre: " + movie.getGenre());
        MovieDetail savedMovie = movieDetailRepository.save(movie);
        System.out.println("Saved movie ID: " + savedMovie.getId());
        return savedMovie;
    }

    public List<MovieDetail> getAllMovies() { // Changed return type
        List<MovieDetail> movies = movieDetailRepository.findAll();
        System.out.println("Found " + movies.size() + " movies");
        for (MovieDetail movie : movies) {
            System.out.println("Movie: " + movie.getTitle() + ", Cast: " + movie.getCast() + ", Genre: " + movie.getGenre());
        }
        return movies;
    }

    public MovieDetail getMovieById(Long id) { // Changed return type
        MovieDetail movie = movieDetailRepository.findById(id).orElse(null);
        if (movie != null) {
            System.out.println("Found movie: " + movie.getTitle() + ", Cast: " + movie.getCast() + ", Genre: " + movie.getGenre());
        }
        return movie;
    }

    public void deleteMovie(Long id) {
        movieDetailRepository.deleteById(id);
    }
}
