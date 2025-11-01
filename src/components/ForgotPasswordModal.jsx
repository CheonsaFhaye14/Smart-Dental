import React, { useState } from "react"; 
import { forgotPassword } from "../services/LoginApi";
import "./ForgotPasswordModal.css";

export default function ForgotPasswordModal({ onClose, setMessage, setMessageType }) {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setMessageType("error");
      setMessage("Please enter your email");
      return;
    }

    try {
      const response = await forgotPassword(email);

      if (response.success) {
        setMessageType("success");
        setMessage("Check your email for password reset instructions!");
        onClose();
      } else {
        setMessageType("error");
        setMessage(response.message || "Failed to send reset email");
      }
    } catch {
      setMessageType("error");
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="modal-content">
        <h2>Forgot Password</h2>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <div className="modal-buttons">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
