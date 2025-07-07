import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardComponent from "./CardComponent";

const CardList = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 🔹 For navigation

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get stored JWT token
    console.log("Using token:", token); // Debug token
  
    fetch("http://localhost:8080/api/cards/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // Ensure token is present
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`HTTP ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setMovies(data.sort((a, b) => b.rating - a.rating));
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
      {/* Show loading spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Display error message if movies fail to load */}
      {error && <Alert variant="danger">⚠ Failed to load movies: {error}</Alert>}

      {/* Display movie cards in rows (3 per row) */}
      {!loading && !error && (
        <Row className="gx-4 gy-4">
          {movies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} className="d-flex">
              <div style={{ cursor: "pointer", width: "100%" }} onClick={() => navigate(`/movie/${movie.id}`)}>
                <CardComponent movie={movie}/>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CardList;
