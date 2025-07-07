import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email") || "No email available";
  const role = localStorage.getItem("role") || "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/favorites/list?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorite movies');
        }
        const movieIds = await response.json();
        
        // Fetch movie details for each favorite movie ID
        const movieDetails = await Promise.all(
          movieIds.map(async (movieId) => {
            const movieResponse = await fetch(`http://localhost:8080/api/moviedetails/${movieId}`);
            if (!movieResponse.ok) {
              console.error(`Failed to fetch movie details for ID ${movieId}`);
              return null;
            }
            return movieResponse.json();
          })
        );
        
        // Filter out any null values and set the movies
        setFavoriteMovies(movieDetails.filter(movie => movie !== null));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [email]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          movieId: movieId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      // Update the local state to remove the movie
      setFavoriteMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Profile</h2>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3 className="mb-4">
            <FontAwesomeIcon icon={faHeart} className="text-danger me-2" />
            Favorite Movies
          </h3>
          
          {loading ? (
            <p>Loading favorite movies...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : favoriteMovies.length === 0 ? (
            <p>No favorite movies yet. Start adding some!</p>
          ) : (
            <Row>
              {favoriteMovies.map((movie) => (
                <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="h-100 bg-dark text-white border-warning">
                    <Card.Img
                      variant="top"
                      src={movie.posterUrl}
                      alt={movie.title}
                      style={{ height: '300px', objectFit: 'cover' }}
                      onClick={() => handleMovieClick(movie.id)}
                      className="cursor-pointer"
                    />
                    <Card.Body>
                      <Card.Title className="text-truncate">{movie.title}</Card.Title>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <FontAwesomeIcon icon={faStar} className="text-warning me-1" />
                          <span>{movie.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFavorite(movie.id)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
