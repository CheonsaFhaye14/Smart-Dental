// Shared validation rules for all auth forms: Login, ForgotPassword, ResetPassword.
// Keeping these in one place means every form enforces the same rules and
// shows the same wording for the same kind of mistake.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Validates a username field (Login).
 * Currently just "required" — extend here if you add format rules later
 * (e.g. min length, allowed characters).
 */
export function validateUsername(username) {
  if (!username || !username.trim()) {
    return "Username is required";
  }
  return "";
}

/**
 * Validates a login password field.
 * Intentionally lighter than validateNewPassword — for login we only need to
 * know "did they type something", not enforce strength rules. Strength rules
 * belong on password *creation* (reset), not on every login attempt.
 */
export function validateLoginPassword(password) {
  if (!password) {
    return "Password is required";
  }
  return "";
}

/**
 * Validates a new password (used on Reset Password).
 * Rule: required, at least 8 characters, and must include a lowercase
 * letter, an uppercase letter, a number, and a special character.
 */
export function validateNewPassword(password) {
  if (!password) {
    return "Password is required";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasLower || !hasUpper) {
    return "Password must include both uppercase and lowercase letters";
  }
  if (!hasNumber) {
    return "Password must include at least one number";
  }
  if (!hasSpecial) {
    return "Password must include at least one special character";
  }
  return "";
}

/**
 * Validates that confirmPassword matches newPassword (Reset Password).
 * Run validateNewPassword on newPassword separately — this only checks the match.
 */
export function validateConfirmPassword(newPassword, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (newPassword !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
}

/**
 * Validates an email field (Forgot Password).
 * Required + basic format check (not exhaustive RFC 5322 — just enough
 * to catch obvious typos like missing "@" or domain).
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return "";
}

/**
 * Convenience: validates the whole Login form at once.
 * Returns { username, password } — each "" if valid, or an error string.
 * Caller decides how to surface these (inline per-field, or a single
 * combined message — see Login.jsx for the pattern used there).
 */
export function validateLoginForm({ username, password }) {
  return {
    username: validateUsername(username),
    password: validateLoginPassword(password),
  };
}

/**
 * Convenience: validates the whole Reset Password form at once.
 * Returns { newPassword, confirmPassword }.
 */
export function validateResetPasswordForm({ newPassword, confirmPassword }) {
  return {
    newPassword: validateNewPassword(newPassword),
    confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
  };
}

/**
 * Convenience: validates the Forgot Password form.
 * Returns { email }.
 */
export function validateForgotPasswordForm({ email }) {
  return {
    email: validateEmail(email),
  };
}

/**
 * Helper: true if every value in a validation result object is "" (no errors).
 * Usage: if (!hasErrors(validateLoginForm({ username, password }))) { ...submit... }
 */
export function hasErrors(validationResult) {
  return Object.values(validationResult).some((msg) => msg !== "");
}