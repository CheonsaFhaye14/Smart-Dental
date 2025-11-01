import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowPasswordInput from "../utils/ShowPasswordInput";
import MessageModal from "../components/MessageModal";
import { resetPassword } from "../services/LoginApi";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get("access_token");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorText("");

    if (!newPassword || !confirmPassword) {
      setMessageType("error");
      setMessage("Please fill in all fields");
      setErrorText("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match");
      setErrorText("Passwords do not match");
      return;
    }

    setLoading(true);
    const response = await resetPassword(token, newPassword);
    setLoading(false);

    if (response.success) {
      setMessageType("success");
      setMessage(response.message);
      setErrorText("");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessageType("error");
      setMessage(response.message);
      setErrorText(response.message);
      
    }
  };

  return (
    <div className="reset-password-container">
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />
      <div className="reset-password-card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <ShowPasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Password"
          />
          <ShowPasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          {errorText && <p className="error-text">{errorText}</p>}
        </form>
      </div>
    </div>
  );
}
