import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./Button.css";

function Button({
  text,
  href,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
}) {
  const className = `btn btn-${variant}${fullWidth ? " btn-full" : ""}`;

  const content = loading ? (
    <>
      <FontAwesomeIcon icon={faSpinner} spin />
      <span>{text}</span>
    </>
  ) : (
    text
  );

  // Navigation: render as a link when href is given
  if (href) {
    const handleClick = (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    };

    return (
      <a
        href={disabled ? undefined : href}
        className={className}
        onClick={handleClick}
        aria-disabled={disabled}
      >
        {content}
      </a>
    );
  }

  // Action: render as a real <button> otherwise
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
}

export default Button;