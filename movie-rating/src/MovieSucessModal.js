import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const MovieSuccessModal = ({ message, isSuccess, onClose, onContinue }) => {
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Enter" && isSuccess) onContinue();
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onClose, onContinue, isSuccess]);

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgba(22, 27, 34, 0.9)", zIndex: 1050 }}
      onClick={onClose} // Close when clicking outside the modal
    >
      <div 
        className="card text-white p-4 shadow-lg text-center"
        style={{ 
          width: "400px", 
          backgroundColor: "#161b22", 
          borderRadius: "12px", 
          border: "1px solid #30363d",
          animation: "fadeIn 0.3s ease-in-out" 
        }}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicked inside
      >
        <div className="mb-3">
          <FontAwesomeIcon 
            icon={isSuccess ? faCheckCircle : faTimesCircle} 
            className={`text-${isSuccess ? "success" : "danger"} fs-1`} 
          />
        </div>
        <p className="fw-semibold">{message}</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="btn btn-outline-light" onClick={onClose}>Close</button>
          {isSuccess && <button className="btn btn-primary" onClick={onContinue}>Continue</button>}
        </div>
      </div>
    </div>
  );
};

export default MovieSuccessModal;
