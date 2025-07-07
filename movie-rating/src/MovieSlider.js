import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function MovieSlider() {
  const [movies, setMovies] = useState([]);
  const token = localStorage.getItem("token");
  const fallbackImage = "https://via.placeholder.com/1920x600?text=Image+Unavailable";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const res = await axios.get("http://localhost:8080/api/movies");
        setMovies(res.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    fetchMovies();
  }, [token]);

  useEffect(() => {
    if (movies.length > 0) {
      setTimeout(() => {
        const el = document.querySelector("#movieCarousel");
        if (el) {
          const bootstrap = require("bootstrap");
          new bootstrap.Carousel(el, {
            interval: 3000,
            ride: "carousel",
            wrap: true,
            pause: "hover",
            touch: true,
          });
        }
      }, 100);
    }
  }, [movies]);

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <div className="container-fluid p-0 m-0" style={{ width: "100vw" }}>
      <div
        id="movieCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner" style={{ height: "60vh" }}>
          {movies.length === 0 ? (
            <div className="carousel-item active text-center text-white bg-dark d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
              <p>Loading movies...</p>
            </div>
          ) : (
            movies.map((movie, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={movie.id}>
                <img
                  src={movie.imageUrl || movie.poster || fallbackImage}
                  className="d-block w-100"
                  style={{
                    objectFit: "cover",
                    height: "60vh",
                  }}
                  alt={movie.title}
                  onError={handleImageError}
                />
                <div className="carousel-caption text-start  bg-opacity-50 p-3 rounded">
                  <h5>{movie.title}</h5>
                  <p style={{ maxWidth: "600px" }}>
                    {movie.description?.length > 200
                      ? movie.description.substring(0, 200) + "..."
                      : movie.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {movies.length > 1 && (
          <>
            <button className="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
