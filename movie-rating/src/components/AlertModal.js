import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AlertModal = ({ message, type, onClose }) => {
  if (!message) return null; // Don't render if no message

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3 shadow`}
      role="alert"
      style={{ zIndex: 1050, minWidth: "300px" }}
    >
      <strong>{type === "success" ? "Success!" : "Error!"}</strong> {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

export default AlertModal;
