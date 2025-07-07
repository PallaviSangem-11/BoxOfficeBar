import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Row, Col, Tabs, Tab, Button, Card } from "react-bootstrap";
import CardList from "./cards/CardList";
import AddCardForm from "./AddCardForm";
import AddMovie from "./moviedetails/AddMovie";
import MovieForm from "./MovieForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReviewsByTitle from "./ReviewsByTitle";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarTheme, setSidebarTheme] = useState("dark");
  const [stats, setStats] = useState({ movies: 0, reviews: 0, popularMovie: "Coming Soon..." });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, reviewsRes] = await Promise.all([
          fetch("http://localhost:8080/api/cards/all"),
          fetch("http://localhost:8080/api/reviews"),
        ]);
        
        const moviesData = await moviesRes.json();
        const reviewsData = await reviewsRes.json();
        
        let highestRatedMovie = "Coming Soon...";
        if (Array.isArray(reviewsData) && reviewsData.length > 0) {
          const topMovie = reviewsData.reduce((max, movie) => (movie.rating > max.rating ? movie : max), reviewsData[0]);
          highestRatedMovie = topMovie.rating > 0 ? topMovie.title : "Coming Soon...";
        }
        
        setStats({
          movies: Array.isArray(moviesData) ? moviesData.length : 0,
          reviews: Array.isArray(reviewsData) ? reviewsData.length : 0,
          popularMovie: highestRatedMovie,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleSidebarTheme = () => {
    setSidebarTheme(sidebarTheme === "light" ? "dark" : "light");
  };

  return (
    <Row className={`g-0 ${sidebarTheme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}> 
      <Col md={2} className={`vh-100 p-3 shadow d-flex flex-column justify-content-between ${sidebarTheme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            
            <Button
              variant={sidebarTheme === "light" ? "dark" : "light"}
              size="sm"
              onClick={toggleSidebarTheme}
              className="d-flex align-items-center"
            >
              <i className={`fas ${sidebarTheme === "light" ? "fa-moon" : "fa-sun"} me-1`}></i>
            </Button>
          </div>
          <ul className="list-unstyled">
            {[{ key: "dashboard", icon: "fa-tachometer-alt", label: "Dashboard" },
              { key: "addMovie", icon: "fa-video", label: "Add Movie" },
              { key: "addMovieCards", icon: "fa-layer-group", label: "Add Cards" },
              { key: "slider", icon: "fa-star", label: "Add Slider" },
              { key: "cards", icon: "fa-clone", label: "Cards" },
              { key: "reviews", icon: "fa-comments", label: "Reviews" }].map((item) => (
              <li key={item.key} className="mb-3">
                <NavLink
                  to="#"
                  onClick={() => setActiveTab(item.key)}
                  className={`btn w-100 text-start ${activeTab === item.key ? "btn-primary text-white fw-bold" : sidebarTheme === "dark" ? "btn-secondary text-white" : "btn-light"}`}
                >
                  <i className={`fas ${item.icon} me-2`}></i> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <p className="small">&copy; {new Date().getFullYear()} Block Buster Inc.</p>
        </div>
      </Col>
      <Col md={10} className="p-4">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="dashboard" title={<span className={activeTab === "dashboard" ? "fw-bold" : ""}>Dashboard</span>}>
            <Row>
              {[
                { title: "Movies Added", value: stats.movies },
                { title: "Total Reviews", value: stats.reviews },
                { title: "Popular Movie", value: "Coming soon" },
              ].map((item, index) => (
                <Col key={index} md={4} className="mb-3">
                  <Card className={`shadow border-primary ${sidebarTheme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>
                    <Card.Body>
                      <Card.Title>{item.title}</Card.Title>
                      <Card.Text className="fs-4 fw-bold">{item.value}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
          <Tab eventKey="addMovie" title="Add Movie">
            <AddMovie theme={sidebarTheme} />
          </Tab>
          <Tab eventKey="addMovieCards" title="Add Movie Cards">
            <AddCardForm theme={sidebarTheme} />
          </Tab>
          <Tab eventKey="slider" title="Add Slider">
            <MovieForm theme={sidebarTheme} />
          </Tab>
          <Tab eventKey="cards" title="Cards List">
            <CardList theme={sidebarTheme} />
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <ReviewsByTitle theme={sidebarTheme} />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
}