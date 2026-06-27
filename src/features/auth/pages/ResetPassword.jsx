import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppInput from "../../../components/common/AppInput";
import MessageModal from "../../../components/ui/MessageModal";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import PasswordRequirements from "../../../components/ui/PasswordRequirements";
import { resetPassword } from "../services/authApi";
import { validateResetPasswordForm, hasErrors } from "../validators/authValidator";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ newPassword: "", confirmPassword: "" });

  const navigate = useNavigate();
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const token = hashParams.get("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");

    const validation = validateResetPasswordForm({ newPassword, confirmPassword });
    setFieldErrors(validation);
    if (hasErrors(validation)) {
      return;
    }

    setLoading(true);
    const response = await resetPassword(token, newPassword);
    setLoading(false);

    if (response.success) {
      // ✅ success → toast only, then navigate away
      setMessageType("success");
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      // ❌ failure → inline text only, stays on page so the user can retry
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

      <Card className="reset-password-card" maxWidth="420px">
        <div className="reset-password-card__icon" aria-hidden="true">
          <i className="ti ti-key" />
        </div>

        <h2 className="reset-password-card__title">Reset Password</h2>

        <form className="reset-password-card__form" onSubmit={handleSubmit}>
          <PasswordRequirements password={newPassword} />

          <AppInput
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={fieldErrors.newPassword}
          />

          <AppInput
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            error={fieldErrors.confirmPassword}
          />

          <Button
            type="submit"
            text={loading ? "Resetting..." : "Reset Password"}
            loading={loading}
            fullWidth
          />

          {errorText && <p className="reset-password-card__error">{errorText}</p>}
        </form>
      </Card>
    </div>
  );
}