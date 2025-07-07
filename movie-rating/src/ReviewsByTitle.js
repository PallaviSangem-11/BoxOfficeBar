import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle, FaFilm, FaVideo, FaStar, FaLanguage, FaThumbsUp } from "react-icons/fa";

const ReviewsByTitle = () => {
  const [title, setTitle] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const fetchReviews = async (searchTitle = '') => {
    try {
      setLoading(true);
      const email = localStorage.getItem('email');
      if (!email) {
        setError("Please log in to view reviews");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/reviews${searchTitle ? `?keyword=${encodeURIComponent(searchTitle)}` : ''}`,
        {
          headers: {
            'User-Email': email
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Initialize helpfulVotes state for each review
        const helpfulVotesState = {};
        data.forEach(review => {
          helpfulVotesState[review.id] = review.isHelpful;
        });
        console.log('Initial helpful votes state:', helpfulVotesState);
        setHelpfulVotes(helpfulVotesState);
        setReviews(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce((searchTitle) => {
    fetchReviews(searchTitle);
  }, 300);

  useEffect(() => {
    if (title.trim()) {
      debouncedSearch(title);
    } else {
      fetchReviews();
    }
    return () => debouncedSearch.cancel();
  }, [title]);

  const handleHelpfulToggle = async (reviewId) => {
    const email = localStorage.getItem('email');
    if (!email) {
      setError("Please log in to vote");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}/vote/toggle`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Email': email
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.helpfulCount !== 'undefined' && typeof data.isHelpful !== 'undefined') {
          // Update both helpfulVotes state and reviews state
          setHelpfulVotes(prev => {
            const newState = { ...prev, [reviewId]: data.isHelpful };
            console.log('Updated helpful votes state:', newState);
            return newState;
          });
          setReviews(prevReviews => 
            prevReviews.map(review => {
              if (review.id === reviewId) {
                return { 
                  ...review, 
                  helpfulVotes: data.helpfulCount,
                  isHelpful: data.isHelpful 
                };
              }
              return review;
            })
          );
        } else {
          console.error('Invalid response format:', data);
          setError("Invalid response from server");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update vote");
      }
    } catch (err) {
      console.error("Toggle vote error:", err);
      setError(err.response?.data || "Failed to update vote");
    }

    await fetchReviews(title); // refetch reviews to get the latest aggregation
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="card bg-dark text-light p-4 rounded mx-auto" style={{ maxWidth: 800 }}>
        <h4 className="mb-4">Latest Reviews</h4>
        <input
          className="form-control mb-4"
          placeholder="Search by movie title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {loading && <div className="text-center"><span className="spinner-border text-warning"></span></div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {reviews.map(review => (
          <div key={review.id} className="bg-secondary bg-opacity-25 rounded p-3 mb-3">
            <div className="d-flex align-items-start">
              <FaUserCircle size={45} className="text-warning me-3" />
              <div>
                <h5 className="fw-bold">{review.movieTitle}</h5>
                <div className="mb-2">{[...Array(review.rating)].map((_,i)=><FaStar key={i} className="text-warning me-1"/>)}</div>
                <p className="mb-1"><FaFilm className="me-1" />Cast: {review.cast}</p>
                <p className="mb-1"><FaVideo className="me-1" />Director: {review.director}</p>
                <p className="mb-1"><FaLanguage className="me-1" />Language: {review.language || "N/A"}</p>
                <p className="mb-1">By: <strong>{review.reviewerName}</strong></p>
                <button
                  className={`btn btn-sm ${helpfulVotes[review.id] ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => handleHelpfulToggle(review.id)}
                >
                  <FaThumbsUp className="me-1" /> Helpful ({review.helpfulVotes})
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && reviews.length === 0 && <div className="text-center text-white-50">No reviews found.</div>}
      </div>
    </div>
  );
};

export default ReviewsByTitle;
