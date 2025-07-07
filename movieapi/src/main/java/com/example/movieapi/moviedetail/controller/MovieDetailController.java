package com.example.movieapi.moviedetail.controller;

import com.example.movieapi.moviedetail.model.MovieDetail;

import com.example.movieapi.moviedetail.service.MovieDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access

@RestController("movieDetailController") // Unique name
@RequestMapping("/api/moviedetails")
public class MovieDetailController {

    @Autowired
    private MovieDetailService movieService;

    @PostMapping
    public MovieDetail addMovie(@RequestBody MovieDetail movie) {
        return movieService.addMovie(movie);
    }

    @GetMapping
    public List<MovieDetail> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public MovieDetail getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return "Movie deleted successfully!";
    }
}
