import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieSuccessModal from "../MovieSucessModal";
import { useNavigate } from "react-router-dom";

const AddMovie = () => {
  const [movie, setMovie] = useState({
    title: "",
    posterUrl: "",
    releaseDate: "",
    synopsis: "",
    rating: "",
    director: "",
    cast: "",
    genre: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedMovie = {
      ...movie,
      rating: parseFloat(movie.rating),
      cast: movie.cast.split(",").map((c) => c.trim()),
      genre: movie.genre.split(",").map((g) => g.trim()),
    };

    axios
      .post("http://localhost:8080/api/moviedetails", formattedMovie)
      .then(() => {
        setMessage("Movie added successfully!");
        setIsSuccess(true);
        setShowModal(true);
        setMovie({
          title: "",
          posterUrl: "",
          releaseDate: "",
          synopsis: "",
          rating: "",
          director: "",
          cast: "",
          genre: "",
        });
      })
      .catch((error) => {
        console.error("Error adding movie:", error);
        setMessage("Failed to add movie.");
        setIsSuccess(false);
        setShowModal(true);
      });
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleContinue = () => {
    setShowModal(false);
    navigate("/movies");
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}>
      <div className="card p-4 shadow-lg text-white"
           style={{ width: "600px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={() => navigate(-1)} style={{ filter: "invert(1)" }}></button>
        </div>
        <h3 className="text-center fw-bold mb-3">Add a New Movie</h3>
        
        {showModal && (
          <MovieSuccessModal 
            message={message} 
            isSuccess={isSuccess} 
            onClose={handleClose} 
            onContinue={handleContinue} 
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Title</label>
              <input type="text" className="form-control text-white" name="title" value={movie.title} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Poster URL</label>
              <input type="text" className="form-control text-white" name="posterUrl" value={movie.posterUrl} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Release Date</label>
              <input type="date" className="form-control text-white" name="releaseDate" value={movie.releaseDate} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Rating (0-10)</label>
              <input type="number" className="form-control text-white" name="rating" value={movie.rating} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required min="0" max="10" step="0.1" />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Synopsis</label>
            <textarea className="form-control text-white" name="synopsis" rows="3" value={movie.synopsis} onChange={handleChange}
                      style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Director</label>
              <input type="text" className="form-control text-white" name="director" value={movie.director} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-light fw-semibold">Cast (comma separated)</label>
              <input type="text" className="form-control text-white" name="cast" value={movie.cast} onChange={handleChange}
                     style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Genres (comma separated)</label>
            <input type="text" className="form-control text-white" name="genre" value={movie.genre} onChange={handleChange}
                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }} required />
          </div>

          <button type="submit" className="btn w-100 fw-bold btn-danger" style={{ border: "none", color: "white" }}>
            Add Movie
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
