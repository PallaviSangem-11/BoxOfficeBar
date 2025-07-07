import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar, FaTrash } from "react-icons/fa";

const highlightText = (text, query) => {
  if (!query || !text) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: 'yellow', color: 'black' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const CardComponent = ({ movie, onDelete, searchQuery }) => {
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      fetch(`http://localhost:8080/api/cards/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the movie");
          }
          alert("Movie deleted successfully!"); // ✅ Show success message
          onDelete(id); // ✅ Remove from UI
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          alert("Failed to delete the movie. Please try again!"); // ❌ Show error message
        });
    }
  };

  return (
    <div className="movie-box p-3 d-flex justify-content-center">
      <Card
        className="text-white movie-card border-0 rounded overflow-hidden shadow-lg"
        style={{ width: "300px", height: "430px", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="position-relative">
          <Card.Img
            src={movie.image_url}
            alt={movie.title}
            className="movie-image rounded"
            style={{ height: "100%", objectFit: "cover" }}
          />
          <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>
        </div>

        <Card.Body className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75">
          <Card.Title className="fw-bold text-center">{highlightText(movie.title, searchQuery)}</Card.Title>
          <Card.Text className="text-center">{movie.release_date}</Card.Text>
          <div className="d-flex justify-content-center align-items-center">
            <span className="me-1">{movie.rating}</span>
            <FaStar className="text-warning" />
          </div>

          <div className="d-flex justify-content-center gap-2 mt-2">
            {movie.languages?.split(",").map((lang, index) => (
              <span key={index} className="badge bg-light text-dark">
                {highlightText(lang.trim(), searchQuery)}
              </span>
            ))}
          </div>

          {/* Delete Button */}
          
        </Card.Body>
      </Card>
    </div>
  );
};

export default CardComponent;
