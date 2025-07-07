import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar } from 'react-icons/fa';

const ReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const m = (await axios.get(`/api/moviedetails/${id}`)).data;
        setMovie(m);
        const revs = (await axios.get(`/api/reviews?keyword=${encodeURIComponent(m.title)}`)).data;
        const filtered = revs.filter(r => r.movieTitle === m.title);
        setAverageRating(filtered.length ? (filtered.reduce((a,r)=>a+r.rating,0)/filtered.length).toFixed(1) : 0);
        const fav = await axios.get(`/api/users/favorites/${id}`, { headers: { Authorization: `Bearer ${token}` }});
        setIsFavorite(fav.data.isFavorite);
      } catch {
        console.error("Fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const res = await axios.post(`/api/users/favorites/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFavorite(res.data.isFavorite); // assuming backend returns { isFavorite: true/false }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    }
  };
  

  if (loading) return <div className="text-center mt-5 text-light">Loading...</div>;
  if (!movie) return <div className="text-center mt-5 text-danger">Movie not found</div>;

  return (
    <div className="container-fluid bg-dark text-light" style={{ minHeight: "100vh" }}>
      <div className="row">
        <div className="col-md-6" style={{ background: `url(${movie.posterUrl}) center/cover`, minHeight: '100vh' }}></div>
        <div className="col-md-6 p-5">
          <h2 className="text-center text-warning">{movie.title}</h2>
          <p><strong>Genre:</strong> {movie.genre.join(", ")}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>
          <p><strong>Language:</strong> {movie.language || "N/A"}</p>
          <div className="text-center mb-3">
            <button className={`btn ${isFavorite?'btn-warning':'btn-outline-warning'}`} onClick={handleFavorite}>
              {isFavorite ? "★ Favorited" : "☆ Add to Favorites"}
            </button>
          </div>
          <div className="border rounded bg-secondary p-3 mb-4">
            <div className="d-flex align-items-center mb-2">
              <FaStar className="text-warning me-2" size={24} /> <h4>{averageRating}/5</h4>
            </div>
            {[...Array(5)].map((_,i)=>(
              <FaStar key={i} className={i < Math.round(averageRating) ? "text-warning" : "text-secondary"} />
            ))}
          </div>
          <button className="btn btn-danger w-100" onClick={() => navigate(`/rating/${id}`)}>Review</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
