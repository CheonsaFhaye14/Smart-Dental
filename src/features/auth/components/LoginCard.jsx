import Card from "../../../components/ui/Card";
import AppInput from "../../../components/common/AppInput";
import Button from "../../../components/ui/Button";
import "./LoginCard.css";

function LoginCard({
  username,
  password,
  loading,
  usernameError,
  passwordError,
  errorText,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <Card className="login-card" maxWidth="420px">
      <div className="login-card__icon" aria-hidden="true">
        <i className="ti ti-lock" />
      </div>

      <h1 className="login-card__title">Admin Login</h1>

      <form className="login-card__form" onSubmit={onSubmit}>

        <AppInput
          type="text"
          label="Username"
          value={username}
          onChange={onUsernameChange}
          error={usernameError}
        />

        <AppInput
          type="password"
          label="Password"
          value={password}
          onChange={onPasswordChange}
          error={passwordError}
        />

        <p className="login-card__forgot">
          <span onClick={onForgotPassword}>Forgot Password?</span>
        </p>

        <Button
          type="submit"
          text={loading ? "Logging in..." : "Login"}
          loading={loading}
          fullWidth
        />

        {/* form-level errors only: server/network failures, not field-specific */}
        {errorText && <p className="login-card__error">{errorText}</p>}
      </form>
    </Card>
  );
}

export default LoginCard;