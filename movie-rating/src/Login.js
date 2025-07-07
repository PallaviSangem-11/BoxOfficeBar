import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import MovieSuccessModal from "./MovieSucessModal";

const Login = ({ setToken, setRole, setUsername }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        const storedEmail = localStorage.getItem("email");

        if (token && userRole) {
            setRole(userRole);
            setUsername(storedEmail || "Guest");
        }
    }, [setRole, setUsername]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setShowModal(false);
        setIsLoading(true);
    
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            const token = data.token;
            if (!token) throw new Error("Token missing in response");

            const userRole = data.role;
            const userEmail = data.email;

            localStorage.setItem("email", userEmail);
            localStorage.setItem("role", userRole);
            localStorage.setItem("token", token);

            setUsername(userEmail);
            setRole(userRole);
            setToken(token);

            setIsSuccess(true);
            setModalMessage(`Welcome ${userEmail}! Redirecting to ${userRole === "ADMIN" ? "dashboard" : "home"}...`);
            setShowModal(true);
            
        } catch (err) {
            console.error("Login Error:", err.message);
            setError(err.message || "Invalid credentials. Please try again.");
            setIsSuccess(false);
            setModalMessage(err.message || "Invalid credentials. Please try again.");
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        setShowModal(false);
        const userRole = localStorage.getItem("role");
        if (userRole === "ADMIN") {
            navigate("/dashboard");
        } else {
            navigate("/home");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="card p-4 shadow-lg text-white" 
                 style={{ width: "400px", backgroundColor: "#161b22", borderRadius: "10px", border: "1px solid #30363d" }}>
                <h3 className="text-center fw-bold mb-3">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Email</label>
                        <input type="email" className="form-control text-white" placeholder="Enter email"
                               style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                               value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-light fw-semibold">Password</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} 
                                   className="form-control text-white" 
                                   placeholder="Enter password"
                                   style={{ backgroundColor: "#0d1117", border: "1px solid #30363d" }}
                                   value={password} 
                                   onChange={(e) => setPassword(e.target.value)} 
                                   required />
                            <button type="button" 
                                    className="btn btn-outline-secondary" 
                                    onClick={togglePasswordVisibility}
                                    style={{ backgroundColor: "#0d1117", border: "1px solid #30363d", color: "#fff" }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <button className="btn w-100 fw-bold btn-danger" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <p className="text-center mt-3">
                        <span className="text-light">Don't have an account? </span>
                        <button 
                            className="btn btn-link text-danger fw-bold p-0" 
                            onClick={() => navigate("/register")}
                            style={{ textDecoration: "none" }}>
                            Create your account
                        </button>
                    </p>
                </form>
                
                {error && (
                    <p className="text-danger mt-2 text-center">
                        <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                    </p>
                )}
            </div>

            {showModal && (
                <MovieSuccessModal 
                    message={modalMessage} 
                    isSuccess={isSuccess} 
                    onClose={() => setShowModal(false)} 
                    onContinue={handleContinue} 
                />
            )}
        </div>
    );
};

export default Login;
