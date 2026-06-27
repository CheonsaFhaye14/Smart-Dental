import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../../services/GetAllUsers";
import { loginUser } from "../services/authApi";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import { validateLoginForm, hasErrors } from "../validators/authValidator";
import MessageModal from "../../../components/ui/MessageModal";
import LoginCard from "../components/sections/LoginCard";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import "./login.css";

function Login() {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [message, setMessage]         = useState("");
  const [messageType, setMessageType] = useState("info");
  const [errorText, setErrorText]     = useState("");
  const [fieldErrors, setFieldErrors] = useState({ username: "", password: "" });
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [loading, setLoading]         = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = validateLoginForm({ username, password });
    setFieldErrors(validation);
    if (hasErrors(validation)) {
      return;
    }

    setErrorText("");
    setLoading(true);
    try {
      const response = await loginUser(username, password);

      if (response.success) {
        login(response.token);
        // ✅ success → toast only, no inline text needed since we're navigating away
        setMessageType("success");
        setMessage("Login successful!");
        await getAllUsers(response.token);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        // ❌ failure (wrong credentials, server-side) → form-level inline text,
        // not field-specific since we don't know which field was actually wrong
        setErrorText(response.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorText("Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <MessageModal
        message={message}
        type={messageType}
        onClose={() => setMessage("")}
      />

      <LoginCard
        username={username}
        password={password}
        loading={loading}
        usernameError={fieldErrors.username}
        passwordError={fieldErrors.password}
        errorText={errorText}
        onUsernameChange={(e) => {
          setUsername(e.target.value);
          setFieldErrors((prev) => ({ ...prev, username: "" }));
        }}
        onPasswordChange={(e) => {
          setPassword(e.target.value);
          setFieldErrors((prev) => ({ ...prev, password: "" }));
        }}
        onSubmit={handleLogin}
        onForgotPassword={() => setForgotModalOpen(true)}
      />

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