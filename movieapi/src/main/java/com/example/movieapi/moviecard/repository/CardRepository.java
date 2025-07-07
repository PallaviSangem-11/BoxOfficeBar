package com.example.movieapi.moviecard.repository;

import com.example.movieapi.moviecard.model.Card;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
	@Modifying
	@Transactional
	@Query(value = "ALTER TABLE cards AUTO_INCREMENT = 1", nativeQuery = true)
	void resetAutoIncrement();

	@Modifying
	@Transactional
	@Query(value = "SET @count = 0", nativeQuery = true)
	void resetCounter();

	@Modifying
	@Transactional
	@Query(value = "UPDATE cards SET id = @count:= @count + 1 ORDER BY id", nativeQuery = true)
	void reorderIds();
}
