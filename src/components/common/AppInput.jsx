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
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  // label floats when focused OR has a value
  const isFloating = focused || (value !== undefined && value !== "");

  return (
    <div className={`app-input__wrapper ${className}`}>
      <div className={`app-input__field ${error ? "app-input__field--error" : ""} ${focused ? "app-input__field--focused" : ""}`}>

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label ? "" : placeholder} /* hide placeholder when using floating label */
          disabled={disabled}
          className="app-input"
          {...rest}
        />

        {/* Floating label */}
        {label && (
          <label className={`app-input__label ${isFloating ? "app-input__label--float" : ""}`}>
            {label}
          </label>
        )}

        {/* Eye icon for password */}
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

      {error && <p className="app-input__error">{error}</p>}
    </div>
  );
}

export default AppInput;