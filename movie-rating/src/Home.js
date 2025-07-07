import React, { useEffect, useState } from "react";
import MovieSlider from "./MovieSlider";
import MovieList from "./homecards/MovieList";
import { useNavigate } from "react-router-dom";
import ReviewsByTitle from "./ReviewsByTitle";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return isAuthenticated ? (
    <div>
      <MovieSlider />
      <MovieList />
      
    </div>
  ) : (
    <p>Redirecting to login...</p>
  );
};

export default Home;
