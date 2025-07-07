import { useState, useEffect } from "react";
import axios from "axios";
import AlertModal from "./components/AlertModal";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios
      .get("http://localhost:8080/api/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setAlertMessage("Failed to fetch movies.");
        setAlertType("danger");
      });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/movies/${id}`);

      if (response.status === 200) {
        setAlertMessage("Movie deleted successfully!");
        setAlertType("success");
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
      } else {
        setAlertMessage("Failed to delete movie.");
        setAlertType("danger");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      setAlertMessage("An error occurred while deleting the movie.");
      setAlertType("danger");
    }
  };

  return (
    <div className="container">
      {/* ✅ Bootstrap Alert */}
      <AlertModal message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />

      <h2 className="text-primary text-center mb-4">Movie List</h2>
      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <img src={movie.imageUrl} alt="Movie" className="card-img-top" style={{ height: "300px", objectFit: "cover" }} />
              <div className="card-body text-center">
                <h5 className="card-title">{movie.title}</h5>
                <button className="btn btn-danger mt-2" onClick={() => handleDelete(movie.id)}>
                  Delete Movie
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
