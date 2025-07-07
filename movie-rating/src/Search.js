import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaStar, FaLanguage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CardComponent from './homecards/CardComponent';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  const navigate = useNavigate();

  const fetchSearchResults = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults({});
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        query: query
      });

      const url = `http://localhost:8080/api/search/advanced?${params.toString()}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResults(response.data.results || {});
    } catch (err) {
      console.error("Search Error:", err);
      setError("Failed to fetch search results. Make sure your backend is running and you are authenticated.");
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSearchResults(searchQuery);
    return () => fetchSearchResults.cancel();
  }, [searchQuery]);

  const renderMovieCard = (movie, query) => (
    <div 
      key={movie.id} 
      style={{ cursor: 'pointer', width: '100%' }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <CardComponent movie={movie} searchQuery={query} />
    </div>
  );

  return (
    <div className="container py-5" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="card bg-dark text-light border-0 shadow-lg p-4 rounded-3" style={{ maxWidth: '800px', margin: 'auto' }}>
        <h4 className="text-center mb-4">Movie Search</h4>
        
        <div className="input-group mb-3">
          <span className="input-group-text bg-secondary border-0">
            <FaSearch className="text-white" />
          </span>
          <input
            type="text"
            className="form-control bg-secondary text-white border-0 shadow-sm"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && Object.keys(searchResults).length > 0 ? (
          <div className="search-results">
            {searchResults.titleMatches && searchResults.titleMatches.length > 0 && (
              <div className="mb-4">
                <h5 className="text-warning mb-3">Title Matches</h5>
                {searchResults.titleMatches.map(movie => renderMovieCard(movie, searchQuery))}
              </div>
            )}
            
            {searchResults.languageMatches && searchResults.languageMatches.length > 0 && (
              <div className="mb-4">
                <h5 className="text-warning mb-3">Language Matches</h5>
                {searchResults.languageMatches.map(movie => renderMovieCard(movie, searchQuery))}
              </div>
            )}

            {searchResults.genreMatches && searchResults.genreMatches.length > 0 && (
              <div className="mb-4">
                <h5 className="text-warning mb-3">Genre Matches</h5>
                {searchResults.genreMatches.map(movie => renderMovieCard(movie, searchQuery))}
              </div>
            )}

            {searchResults.castMatches && searchResults.castMatches.length > 0 && (
              <div className="mb-4">
                <h5 className="text-warning mb-3">Cast Matches</h5>
                {searchResults.castMatches.map(movie => renderMovieCard(movie, searchQuery))}
              </div>
            )}

          </div>
        ) : (!loading && !error && searchQuery && Object.keys(searchResults).length === 0) ? (
          <p className="text-center text-white-50">No results found for "{searchQuery}"</p>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
