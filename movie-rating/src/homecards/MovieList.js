import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardComponent from "./CardComponent";

const MovieList = () => {
  const [moviesByLanguage, setMoviesByLanguage] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/cards/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const groupedMovies = {};

        data.forEach((movie) => {
          let languages = movie.languages;

          // Ensure languages is an array
          if (!Array.isArray(languages)) {
            languages = languages ? languages.split(",").map(lang => lang.trim()) : ["Unknown"];
          }

          languages.forEach((language) => {
            if (!groupedMovies[language]) {
              groupedMovies[language] = [];
            }
            groupedMovies[language].push(movie);
          });
        });

        setMoviesByLanguage(groupedMovies);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="py-4">
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">⚠ Failed to load movies: {error}</Alert>}

      {!loading &&
        !error &&
        Object.entries(moviesByLanguage).map(([language, movies]) => (
          <div key={language}>
            <h3 className="text-left font-weight-bold my-4 px-3 py-2 rounded bg-secondary text-white">
              {language} Movies
            </h3>
            <Row className="gx-4 gy-4">
              {movies.map((movie) => (
                <Col key={movie.id} xs={12} sm={6} md={4} className="d-flex">
                  <div
                    style={{ cursor: "pointer", width: "100%" }}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <CardComponent movie={movie} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        ))}
    </Container>
  );
};

export default MovieList;
