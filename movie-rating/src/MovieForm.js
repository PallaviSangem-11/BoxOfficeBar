import { useState } from "react";
import axios from "axios";
import MovieSuccessModal from "./MovieSucessModal";

const MovieForm = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl.trim()) {
      setMessage("Please enter a movie image URL!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/movies/add", { imageUrl });
      setMessage("Movie added successfully!");
      setIsSuccess(true);
      setShowModal(true);
      setImageUrl(""); // Clear the input field on success
    } catch (error) {
      console.error("Error adding movie:", error);
      setMessage("Failed to add movie.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false); // Hide the modal
  };

  const handleContinue = () => {
    setShowModal(false); // Hide the modal
    if (isSuccess) {
      window.history.back(); // Go back to the previous page after success
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}>
      <div className="card p-4 shadow-lg text-white"
           style={{ width: "500px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={() => window.history.back()} style={{ filter: "invert(1)" }}></button>
        </div>
        <h3 className="text-center fw-bold mb-3">Add a New Movie</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Movie Image URL</label>
            <input type="text" className="form-control text-white" placeholder="Enter movie image URL"
                   value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>
          <button type="submit" className="btn w-100 fw-bold btn-danger" style={{ border: "none", color: "white" }}>
            Add Movie
          </button>
        </form>
      </div>

      {/* Show success/error modal */}
      {showModal && (
        <MovieSuccessModal 
          message={message} 
          isSuccess={isSuccess} 
          onClose={handleClose} 
          onContinue={handleContinue} 
        />
      )}
    </div>
  );
};

export default MovieForm;
