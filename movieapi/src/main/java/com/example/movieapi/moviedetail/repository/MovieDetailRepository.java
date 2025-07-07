package com.example.movieapi.moviedetail.repository;

import com.example.movieapi.moviedetail.model.MovieDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieDetailRepository extends JpaRepository<MovieDetail, Long> {
    @Query("SELECT md FROM MovieDetail md WHERE LOWER(md.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<MovieDetail> findByTitleContainingIgnoreCase(@Param("title") String title);

    @Query("SELECT md FROM MovieDetail md WHERE LOWER(md.director) LIKE LOWER(CONCAT('%', :director, '%'))")
    List<MovieDetail> findByDirectorContainingIgnoreCase(@Param("director") String director);

    @Query("SELECT md FROM MovieDetail md JOIN md.cast c WHERE LOWER(c) LIKE LOWER(CONCAT('%', :castName, '%'))")
    List<MovieDetail> findByCastContainingIgnoreCase(@Param("castName") String castName);

    @Query("SELECT md FROM MovieDetail md JOIN md.genre g WHERE LOWER(g) LIKE LOWER(CONCAT('%', :genreName, '%'))")
    List<MovieDetail> findByGenreContainingIgnoreCase(@Param("genreName") String genreName);

    @Query("SELECT md FROM MovieDetail md WHERE LOWER(md.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(md.director) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "EXISTS (SELECT c FROM md.cast c WHERE LOWER(c) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
            "EXISTS (SELECT g FROM md.genre g WHERE LOWER(g) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<MovieDetail> findByAllDetailsContainingIgnoreCase(@Param("query") String query);
}
