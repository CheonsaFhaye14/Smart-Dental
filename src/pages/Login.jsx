import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/LoginApi";
import MessageModal from "../components/MessageModal";
import ShowPasswordInput from "../utils/ShowPasswordInput";
import { useAdminAuth } from "../hooks/useAdminAuth";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons"; // ⚡ import spinner icon
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [errorText, setErrorText] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // ⚡ loading state
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      const msg = "Please fill in all fields";
      setMessageType("error");
      setMessage(msg);
      setErrorText(msg);
      return;
    }

    setLoading(true); // ⚡ start loading

    const response = await loginUser(username, password);

    setLoading(false); // ⚡ stop loading after response

    if (response.success) {
      login(response.token);
      localStorage.setItem("adminId", response.adminId);
      localStorage.setItem("adminUsername", response.adminUsername);

      setMessageType("success");
      setMessage("Login successful!");
      setErrorText("");

      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      const msg = response.message || "Invalid username or password";
      setMessageType("error");
      setMessage(msg);
      setErrorText(msg);
    }
  };

  return (
    <div className="login-container">
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <div className="login-card">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <ShowPasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <p className="forgot-password">
            <span
              onClick={() => setForgotModalOpen(true)}
              style={{ cursor: "pointer", color: "#75c5f1", fontWeight: 500 }}
            >
              Forgot Password?
            </span>
          </p>

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> {/* ⚡ spinning icon */}
                <span style={{ marginLeft: "8px" }}>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>

          {errorText && <p className="error-text">{errorText}</p>}
        </form>
      </div>

      {forgotModalOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotModalOpen(false)}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}
    </div>
  );
}

export default Login;
