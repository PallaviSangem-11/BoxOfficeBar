import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieSuccessModal from "./MovieSucessModal";// Import the modal component
import "bootstrap/dist/css/bootstrap.min.css";

export default function MovieReviewForm() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [movieTitle, setMovieTitle] = useState("");
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState("");
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [modalMessage, setModalMessage] = useState(null); // Manage modal message
  const [isSuccess, setIsSuccess] = useState(true); // Manage modal type (success/error)
  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setEmail(userEmail);
      // Extract username from email (remove domain part)
      const username = userEmail.split('@')[0];
      setName(username);
    }

    // Fetch movie details and check for existing review
    const fetchMovieAndCheckReview = async () => {
      try {
        const [movieResponse, reviewsResponse] = await Promise.all([
          fetch(`http://localhost:8080/api/moviedetails/${id}`),
          fetch(`http://localhost:8080/api/reviews?email=${encodeURIComponent(userEmail)}`)
        ]);

        const movieData = await movieResponse.json();
        const reviewsData = await reviewsResponse.json();

        setMovieTitle(movieData.title);
        setDirector(movieData.director);
        setCast(movieData.cast.join(", "));

        // Check if user has already reviewed this movie
        const existingReview = reviewsData.find(review => 
          review.movieTitle === movieData.title && review.email === userEmail
        );
        setHasExistingReview(!!existingReview);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userEmail) {
      fetchMovieAndCheckReview();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !reviewText) {
      setModalMessage("Please fill in all required fields.");
      setIsSuccess(false);
      return;
    }

    if (hasExistingReview) {
      setModalMessage("You have already reviewed this movie.");
      setIsSuccess(false);
      return;
    }

    const reviewData = {
      reviewerName: name,
      email,
      movieTitle,
      director,
      cast,
      rating,
      reviewText,
      helpfulVotes: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setModalMessage("Review submitted successfully!");
        setIsSuccess(true);
        setReviewText("");
        setRating(1);
        setHasExistingReview(true);
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.message || "Failed to submit review.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setModalMessage("An error occurred while submitting the review.");
      setIsSuccess(false);
    }
  };

  if (hasExistingReview) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
           style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}>
        <div className="card p-4 shadow-lg text-white"
             style={{ width: "600px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
          <div className="d-flex justify-content-end">
            <button className="btn-close" onClick={() => window.history.back()} style={{ filter: "invert(1)" }}></button>
          </div>
          <h3 className="text-center fw-bold mb-3">Already Reviewed</h3>
          <p className="text-center">You have already submitted a review for this movie.</p>
          <button className="btn btn-warning w-100" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
         style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}>
      <div className="card p-4 shadow-lg text-white"
           style={{ width: "600px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={() => window.history.back()} style={{ filter: "invert(1)" }}></button>
        </div>
        <h3 className="text-center fw-bold mb-3">Submit a Movie Review</h3>
        
        {/* User Info - Read Only */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-light fw-semibold">Your Name</label>
            <input type="text" className="form-control text-white" value={name} readOnly
                   style={{ backgroundColor: "#30363d", border: "1px solid #30363d", cursor: "not-allowed" }} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-light fw-semibold">Your Email</label>
            <input type="email" className="form-control text-white" value={email} readOnly
                   style={{ backgroundColor: "#30363d", border: "1px solid #30363d", cursor: "not-allowed" }} />
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-light fw-semibold">Movie Title</label>
            <input type="text" className="form-control text-white" value={movieTitle} readOnly
                   style={{ backgroundColor: "#30363d", border: "1px solid #30363d", cursor: "not-allowed" }} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-light fw-semibold">Director</label>
            <input type="text" className="form-control text-white" value={director} readOnly
                   style={{ backgroundColor: "#30363d", border: "1px solid #30363d", cursor: "not-allowed" }} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label text-light fw-semibold">Cast</label>
          <input type="text" className="form-control text-white" value={cast} readOnly
                 style={{ backgroundColor: "#30363d", border: "1px solid #30363d", cursor: "not-allowed" }} />
        </div>

        {/* Review Text */}
        <div className="mb-3">
          <label className="form-label text-light fw-semibold">Review</label>
          <textarea className="form-control text-white" rows="3" placeholder="Write your review here..."
                    style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                    value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <label className="form-label text-light fw-semibold">Rating</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button key={num} className={`btn ${rating === num ? "btn-warning" : "btn-outline-warning"}`}
                      onClick={() => setRating(num)}>{num} ⭐</button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-warning w-100" onClick={handleSubmit}>
          Submit Review
        </button>
      </div>

      {/* Show Modal when there's a message */}
      {modalMessage && (
        <MovieSuccessModal 
          message={modalMessage} 
          isSuccess={isSuccess} 
          onClose={() => setModalMessage(null)} 
        />
      )}
    </div>
  );
}
