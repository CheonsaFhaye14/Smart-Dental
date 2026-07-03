import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./AppInput.css";

function AppInput({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = "",
  icon,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const isFloating = focused || (value !== undefined && value !== "");

  return (
    <div className={`app-input__wrapper ${className}`}>
      <div className={`app-input__field ${error ? "app-input__field--error" : ""} ${focused ? "app-input__field--focused" : ""}`}>

        {icon && (
          <span className="app-input__icon">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}

        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label ? "" : placeholder}
          disabled={disabled}
          className={`app-input ${icon ? "app-input--has-icon" : ""}`}
          {...rest}
        />

        {label && (
          <label className={`app-input__label ${icon ? "app-input__label--with-icon" : ""} ${isFloating ? "app-input__label--float" : ""}`}>
            {label}
          </label>
        )}

        {isPassword && (
          <span
            className="app-input__eye"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        )}
      </div>

      <p className={`app-input__error ${error ? "app-input__error--visible" : ""}`}>
        {error || "\u00A0"}
      </p>
    </div>
  );
}

export default AppInput;