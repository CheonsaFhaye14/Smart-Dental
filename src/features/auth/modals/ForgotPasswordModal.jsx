import { useState } from "react";
import { forgotPassword } from "../services/authApi";
import { validateEmail } from "../validators/authValidator";
import AppModal from "../../../components/common/AppModal";
import AppInput from "../../../components/common/AppInput";
import Button from "../../../components/ui/Button";
import "./ForgotPasswordModal.css";

export default function ForgotPasswordModal({ onClose, setMessage, setMessageType }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async () => {
    const validationError = validateEmail(email);
    setEmailError(validationError);
    if (validationError) {
      return;
    }

    setErrorText("");
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.success) {
        // ✅ success → toast only, modal closes so inline text wouldn't be seen anyway
        setMessageType("success");
        setMessage("Check your email for password reset instructions!");
        onClose();
      } else {
        // ❌ failure → inline text only, modal stays open so the user can retry
        setErrorText(response.message || "Failed to send reset email");
      }
    } catch {
      setErrorText("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal
      isOpen
      onClose={onClose}
      title="Forgot Password"
      subtitle="Enter your email and we'll send you reset instructions."
    >
      <AppInput
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
        error={emailError}
        disabled={loading}
      />

      {errorText && <p className="forgot-modal__error">{errorText}</p>}

      <div className="forgot-modal__buttons">
        <Button
          text="Cancel"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          fullWidth
        />
        <Button
          text={loading ? "Sending..." : "Send Reset Link"}
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          fullWidth
        />
      </div>
    </AppModal>
  );
}