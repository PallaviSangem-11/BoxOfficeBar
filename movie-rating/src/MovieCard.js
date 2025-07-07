import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CardComponent from "./cards/CardComponent";
import "bootstrap/dist/css/bootstrap.min.css";

const MovieList = ({ movies, error }) => {
  return (
    <Container className="py-4">
      {/* Display error message if movies fail to load */}
      {error && <p className="text-danger text-center">⚠ Failed to load movies: {error}</p>}

      {/* Display movies in rows with exactly 3 cards per row */}
      <Row className="gx-4 gy-4 justify-content-center">
        {movies.map((movie) => (
          <Col key={movie.id} xs={12} sm={6} md={4} lg={4} className="d-flex">
            <CardComponent movie={movie} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MovieList;
