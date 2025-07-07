import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import MovieCard from "./MovieCard"; // Ensure this component is correctly implemented to display movie details

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [groupedMovies, setGroupedMovies] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [languages, setLanguages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        organizeMoviesByGenre(data);
        extractLanguages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const organizeMoviesByGenre = (movies) => {
    const grouped = movies.reduce((acc, movie) => {
      const genres = movie.genre ? movie.genre.split(",") : ["Unknown"];
      genres.forEach((genre) => {
        const trimmedGenre = genre.trim();
        if (!acc[trimmedGenre]) {
          acc[trimmedGenre] = [];
        }
        acc[trimmedGenre].push(movie);
      });
      return acc;
    }, {});
    setGroupedMovies(grouped);
  };

  const extractLanguages = (movies) => {
    const langs = new Set();
    movies.forEach((movie) => {
      if (movie.language) {
        langs.add(movie.language);
      }
    });
    setLanguages(langs);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const filteredMoviesByLanguage = (movies) => {
    if (selectedLanguage === "All") {
      return movies;
    }
    return movies.filter((movie) => movie.language === selectedLanguage);
  };

  return (
    <Container className="py-4">
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">⚠ Failed to load movies: {error}</Alert>}

      {!loading && !error && (
        <>
          <Form.Group controlId="languageSelect" className="mb-4">
            <Form.Label>Select Language:</Form.Label>
            <Form.Control as="select" value={selectedLanguage} onChange={handleLanguageChange}>
              <option value="All">All</option>
              {[...languages].map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {Object.keys(groupedMovies).map((genre) => {
            const moviesByGenre = filteredMoviesByLanguage(groupedMovies[genre]);
            if (moviesByGenre.length === 0) {
              return null;
            }
            return (
              <div key={genre} className="mb-5">
                <h3 className="text-primary mb-4">{genre}</h3>
                <Row className="gx-4 gy-4">
                  {moviesByGenre.map((movie) => (
                    <Col key={movie.id} xs={12} sm={6} md={4} className="d-flex">
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              </div>
            );
          })}
        </>
      )}
    </Container>
  );
};

export default MovieList;
