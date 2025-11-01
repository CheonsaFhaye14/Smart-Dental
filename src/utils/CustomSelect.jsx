import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

export default function CustomSelect({ options, value, onChange, placeholder, name }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleSelect = (option) => {
    onChange && onChange({ target: { name, value: option } });
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="input-container custom-select-container" ref={containerRef} style={{ position: "relative" }}>
      <input
        type="text"
        readOnly
        value={value || ""}
        className="floating-input"
        onClick={() => setOpen(prev => !prev)}
      />
      <label className={`floating-label ${value ? "has-value" : ""}`}>
        {placeholder}
      </label>

      {open && (
        <ul className="dropdown-list">
          {options.map((opt) => (
            <li
              key={opt}
              className="dropdown-item"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
