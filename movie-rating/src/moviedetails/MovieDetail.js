import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaStar, FaShareAlt, FaHeart, FaRegHeart, FaUserCircle,
  FaQuoteLeft, FaEnvelope, FaWhatsapp, FaThumbsUp
} from 'react-icons/fa';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/moviedetails/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const data = await res.json();
        setMovie(data);

        if (email) {
          const favRes = await fetch(`http://localhost:8080/api/favorites/status?email=${encodeURIComponent(email)}&movieId=${id}`);
          if (favRes.ok) {
            const { favorited } = await favRes.json();
            setIsFavorite(favorited);
          }
        }

        await fetchReviews(data.title);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/movies/related/${movie.id}`);
        if (res.ok) setRelatedMovies(await res.json());
      } catch (e) {
        console.error('Error fetching related:', e);
      }
    })();
  }, [movie]);

  const fetchReviews = async (title) => {
    try {
      const email = localStorage.getItem('email');
      const res = await fetch(`http://localhost:8080/api/reviews?title=${encodeURIComponent(title)}`, {
        headers: {
          'User-Email': email || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        const filtered = data.filter(r => r.movieTitle === title);
        const helpfulVotesState = {};
        filtered.forEach(review => {
          helpfulVotesState[review.id] = review.isHelpful;
        });
        setHelpfulVotes(helpfulVotesState);
        setReviews(filtered);
        const avg = filtered.length > 0
          ? (filtered.reduce((a, r) => a + r.rating, 0) / filtered.length).toFixed(1)
          : 0;
        setAverageRating(avg);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch reviews:', errorData);
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
    }
  };

  const handleFavoriteClick = async () => {
    const email = localStorage.getItem('email');
    if (!email) return alert('Please login to add favorites');
    try {
      const res = await fetch(`http://localhost:8080/api/favorites/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, movieId: movie.id }),
      });
      if (res.ok) {
        const json = await res.json();
        setIsFavorite(json.favorited);
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    }
  };

  const handleReviewClick = () => {
    const email = localStorage.getItem('email');
    if (!email) return alert('Please login to submit a review');
    if (reviews.some(r => r.email === email)) {
      return alert('You have already reviewed this movie');
    }
    navigate(`/rating/${id}`);
  };

  const handleWatchTrailer = () => {
    if (movie.trailerUrl) window.open(movie.trailerUrl, '_blank');
    else alert('Trailer not available');
  };

  const handleHelpfulClick = async (reviewId) => {
    const email = localStorage.getItem('email');
    if (!email) return alert('Please login to vote');

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${reviewId}/vote/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Email': email
        }
      });

      if (response.ok) {
        const { helpfulCount, isHelpful } = await response.json();
        setHelpfulVotes(prev => ({ ...prev, [reviewId]: isHelpful }));
        setReviews(prev =>
          prev.map(r =>
            r.id === reviewId
              ? {
                  ...r,
                  helpfulVotes: helpfulCount,
                  isHelpful: isHelpful
                }
              : r
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to update helpful vote:', errorData);
        alert(errorData.message || 'Failed to update helpful vote');
      }
    } catch (e) {
      console.error('Error updating helpful votes:', e);
      alert('An error occurred while updating the vote');
    }
  };

  const handleShare = (type) => {
    const url = window.location.href;
    const text = `Check out this movie: ${movie.title}`;
    if (type === 'email') window.location.href = `mailto:?subject=${encodeURIComponent(movie.title)}&body=${encodeURIComponent(text + '\n' + url)}`;
    else if (type === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`);
  };

  const getSortedReviews = () => [...reviews].sort((a, b) =>
    sortBy === 'recent'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : b.rating - a.rating
  );

  const getTopRatedReviews = () => [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 6);

  const renderReviewCard = (review) => (
    <div key={review.id} className="card bg-dark text-light mb-3 p-3 col-md-6">
      <div className="d-flex align-items-center mb-2">
        <FaUserCircle size={30} className="me-2" />
        <strong>{review.email}</strong>
      </div>
      <div className="mb-2">
        {[...Array(5)].map((_, i) =>
          <FaStar key={i} style={{ color: i < review.rating ? '#ffc107' : '#ccc' }} />
        )}
      </div>
      <p className="fst-italic"><FaQuoteLeft className="me-2" />{review.reviewText}</p>

      <p className="text-muted">Language: <strong>{review.language || 'N/A'}</strong></p>
      <button 
        className={`btn btn-sm ${helpfulVotes[review.id] ? 'btn-warning' : 'btn-outline-warning'}`} 
        onClick={() => handleHelpfulClick(review.id)}
      >
        <FaThumbsUp className="me-1" /> Helpful ({review.helpfulVotes})
      </button>
    </div>
  );

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><div className="spinner-border text-warning" role="status" /></div>;
  if (error || !movie) return <div className="text-center text-danger mt-5"><h2>Movie not found</h2><p>Sorry, we couldn't find the movie you're looking for.</p></div>;

  return (
    <div className="text-light" style={{
      background: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url(${movie.backgroundUrl})`,
      backgroundSize: 'cover', minHeight: '100vh', padding: '2rem'
    }}>
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-4">
            <img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded mb-3" />
            <button className="btn btn-outline-light w-100 mb-2" onClick={handleWatchTrailer}>Watch Trailer</button>
            <button className="btn btn-warning w-100" onClick={handleReviewClick}>Add a Review</button>
          </div>

          {/* Main */}
          <div className="col-md-8">
            <h1 className="text-uppercase">{movie.title} ({new Date(movie.releaseDate).getFullYear()})</h1>
            <div className="d-flex mb-3">
              <button className="btn btn-outline-danger me-2" onClick={handleFavoriteClick}>
                {isFavorite ? <FaHeart color="#ff4444" /> : <FaRegHeart />} {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
              <button className="btn btn-outline-light me-1" onClick={() => handleShare('email')}><FaEnvelope /></button>
              <button className="btn btn-outline-light" onClick={() => handleShare('whatsapp')}><FaWhatsapp /></button>
            </div>

            <div className="border rounded p-3 mb-4 bg-dark">
              <h4><FaStar className="text-warning me-2" />{averageRating}/5.0</h4>
              <p>{reviews.length} Reviews</p>
              {[...Array(5)].map((_, i) =>
                <FaStar key={i} className={i < Math.floor(averageRating) ? "text-warning" : "text-secondary"} />
              )}
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
              {['overview', 'reviews', 'related'].map(tab => (
                <li className="nav-item" key={tab}>
                  <button className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                <p>{movie.synopsis}</p>
                <div className="row">
                  <div className="col-md-6"><p><strong>Director:</strong> {movie.director}</p></div>
                  <div className="col-md-6"><p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p></div>
                  <div className="col-md-6"><p><strong>Genre:</strong> {movie.genre}</p></div>
                  <div className="col-md-6"><p><strong>Language:</strong> {movie.language}</p></div>
                </div>
                {reviews.length > 0 && (
                  <>
                    <h5 className="mt-4">Top Rated Reviews</h5>
                    <div className="row">{getTopRatedReviews().map(renderReviewCard)}</div>
                    {reviews.length > 6 && <button className="btn btn-outline-warning mt-3" onClick={() => setActiveTab('reviews')}>View All Reviews</button>}
                  </>
                )}
              </>
            )}

            {activeTab === 'reviews' && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>All Reviews</h5>
                  <div>
                    <button className={`btn btn-sm ${sortBy === 'recent' ? 'btn-warning' : 'btn-outline-warning'} me-2`} onClick={() => setSortBy('recent')}>Recent</button>
                    <button className={`btn btn-sm ${sortBy === 'rating' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setSortBy('rating')}>Highest Rated</button>
                  </div>
                </div>

                {localStorage.getItem('email') && reviews.some(r => r.email === localStorage.getItem('email')) && (
                  <>
                    <div className="card bg-dark text-white border-warning mb-3 p-3">
                      <h6 className="text-warning">Your Review</h6>
                      {renderReviewCard(reviews.find(r => r.email === localStorage.getItem('email')))}
                    </div>
                  </>
                )}

                {reviews.length > 0 ? (
                  <div className="row">
                    {getSortedReviews()
                      .filter(r => r.email !== localStorage.getItem('email'))
                      .map(renderReviewCard)}
                  </div>
                ) : (
                  <div className="text-white mt-3">
                    <p>No reviews available.</p>
                    <button className="btn btn-warning" onClick={handleReviewClick}>Be the first to review</button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'related' && (
              <>
                <h3>Related Movies</h3>
                <div className="row">
                  {relatedMovies.map(m => (
                    <div key={m.id} className="col-md-4 mb-3" onClick={() => navigate(`/movie/${m.id}`)} style={{ cursor: 'pointer' }}>
                      <div className="card bg-dark text-light">
                        <img src={m.posterUrl} alt={m.title} className="card-img-top" />
                        <div className="card-body">
                          <h5 className="card-title">{m.title}</h5>
                          <p className="card-text">{m.rating}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
