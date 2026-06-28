import { useState, useRef, useEffect } from "react";
import "./AppSelect.css";

function AppSelect({
  value,
  onChange,
  label,
  options = [],
  error,
  disabled = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const isFloating = open || !!selected;

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  };

  return (
    <div className={`app-select__wrapper ${className}`} ref={wrapperRef}>

      {/* field — owns the border and clips trigger corners */}
      <div className={`app-select__field
        ${error ? "app-select__field--error"  : ""}
        ${open  ? "app-select__field--focused" : ""}
      `}>
        <button
          type="button"
          className="app-select__trigger"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
        >
          <span className={`app-select__value ${!selected ? "app-select__value--empty" : ""}`}>
            {selected ? selected.label : ""}
          </span>
        </button>

        {label && (
          <label className={`app-select__label ${isFloating ? "app-select__label--float" : ""}`}>
            {label}
          </label>
        )}

        <span className={`app-select__arrow ${open ? "app-select__arrow--open" : ""}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {/* dropdown — outside .app-select__field so overflow:hidden doesn't clip it */}
      {open && (
        <div className="app-select__dropdown">
          <div
            className={`app-select__option app-select__option--empty ${!value ? "app-select__option--active" : ""}`}
            onClick={() => handleSelect({ value: "" })}
          >
            — None —
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`app-select__option ${opt.value === value ? "app-select__option--active" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.value === value && <span className="app-select__check">✓</span>}
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="app-select__error">{error}</p>}
    </div>
  );
}

export default AppSelect;