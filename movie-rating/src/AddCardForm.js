import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieSuccessModal from "./MovieSucessModal";

const AddCardForm = () => {
  const [movie, setMovie] = useState({
    title: "",
    image_url: "",
    languages: "",
    rating: "",
    release_date: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!movie.title.trim() || !movie.image_url.trim() || !movie.languages.trim() || !movie.rating.trim() || !movie.release_date.trim()) {
      setMessage("All fields are required!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    const newCard = { ...movie, rating: parseFloat(movie.rating) };

    try {
      const response = await fetch("http://localhost:8080/api/cards/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        setMessage("Movie added successfully!");
        setIsSuccess(true);
        setShowModal(true);
        setMovie({ title: "", image_url: "", languages: "", rating: "", release_date: "" });
      } else {
        setMessage("Failed to add movie!");
        setIsSuccess(false);
        setShowModal(true);
      }
    } catch (error) {
      setMessage("An error occurred. Try again.");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleContinue = () => {
    setShowModal(false);
    if (isSuccess) {
      window.history.back();
    }
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}>
      <div className="card p-4 shadow-lg text-white"
           style={{ width: "600px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={handleClose} style={{ filter: "invert(1)" }}></button>
        </div>
        <h3 className="text-center fw-bold mb-3">Add a New Movie</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Title</label>
            <input type="text" className="form-control text-white" name="title" value={movie.title} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Image URL</label>
            <input type="text" className="form-control text-white" name="image_url" value={movie.image_url} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Languages</label>
            <input type="text" className="form-control text-white" name="languages" value={movie.languages} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Rating (0-10)</label>
            <input type="number" className="form-control text-white" name="rating" value={movie.rating} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required min="0" max="10" step="0.1" />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Release Date</label>
            <input type="date" className="form-control text-white" name="release_date" value={movie.release_date} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>

          <button type="submit" className="btn w-100 fw-bold btn-danger" style={{ border: "none", color: "white" }}>
            Add Movie
          </button>
        </form>
      </div>

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

export default AddCardForm;
