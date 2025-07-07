import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar, FaTrash } from "react-icons/fa";
import MovieSuccessModal from "../MovieSucessModal"; // Import the MovieSuccessModal component

const CardComponent = ({ movie, onDelete }) => {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      fetch(`http://localhost:8080/api/cards/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the movie");
          }
          setMessage("Movie deleted successfully!"); // ✅ Success message
          setIsSuccess(true); // Set to true to indicate success
          onDelete(id); // Remove from UI
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          setMessage("Failed to delete the movie. Please try again!"); // ❌ Error message
          setIsSuccess(false); // Set to false for failure
        })
        .finally(() => {
          setShowAlert(true); // Show the modal
        });
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleContinue = () => {
    setShowAlert(false);
    if (isSuccess) {
      window.history.back(); // You can change this behavior based on what you'd like after success
    }
  };

  return (
    <>
      {/* MovieSuccessModal for success or failure messages */}
      {showAlert && (
        <MovieSuccessModal
          message={message}
          isSuccess={isSuccess}
          onClose={handleCloseAlert}
          onContinue={handleContinue}
        />
      )}

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
            <Card.Title className="fw-bold text-center">{movie.title}</Card.Title>
            <Card.Text className="text-center">{movie.release_date}</Card.Text>
            <div className="d-flex justify-content-center align-items-center">
              <span className="me-1">{movie.rating}</span>
              <FaStar className="text-warning" />
            </div>

            <div className="d-flex justify-content-center gap-2 mt-2">
              {movie.languages?.split(",").map((lang, index) => (
                <span key={index} className="badge bg-light text-dark">
                  {lang.trim()}
                </span>
              ))}
            </div>

            {/* Delete Button */}
            <div className="text-center mt-3">
              <Button variant="danger" onClick={() => handleDelete(movie.id)}>
                <FaTrash className="me-1" /> Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default CardComponent;
