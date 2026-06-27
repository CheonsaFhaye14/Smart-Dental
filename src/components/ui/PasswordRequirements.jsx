import "./PasswordRequirements.css";

// Mirrors the rules in services/authValidator.js (validateNewPassword).
// If you change the rules there, update this list too so the checklist
// and the actual validation never disagree.
const RULES = [
  { id: "length", label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { id: "upper", label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { id: "number", label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { id: "special", label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function PasswordRequirements({ password = "" }) {
  return (
    <ul className="password-requirements" aria-live="polite">
      {RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={`password-requirements__item ${met ? "password-requirements__item--met" : ""}`}
          >
            <i
              className={`ti ${met ? "ti-circle-check" : "ti-circle"} password-requirements__icon`}
              aria-hidden="true"
            />
            <span>{rule.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordRequirements;