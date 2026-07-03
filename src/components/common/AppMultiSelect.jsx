import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./AppMultiSelect.css";

/**
 * AppMultiSelect
 * Searchable dropdown checklist, styled to match AppSelect.
 *
 * @param {string} label
 * @param {string[]} value - array of selected strings
 * @param {(vals: string[]) => void} onChange
 * @param {string[]} options - suggestion list to search/select from
 * @param {string} error
 * @param {boolean} disabled
 * @param {boolean} allowCustom - allow adding values not in `options`
 * @param {string} className
 */
export default function AppMultiSelect({
  label,
  value = [],
  onChange,
  options = [],
  error,
  disabled = false,
  allowCustom = true,
  onAddCustom,        // ← add this
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState("below"); // "below" | "above"
  const wrapperRef = useRef(null);

  const isFloating = open || value.length > 0;

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (disabled) return;

    if (!open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const estimatedDropdownHeight = Math.min((options.length + 1) * 44, 260);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setDropdownPosition(
        spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow
          ? "above"
          : "below"
      );
    }

    setOpen((o) => !o);
  };

  const toggleValue = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeChip = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const searchTrimmed = search.trim();
  const exactMatch = options.some(
    (o) => o.toLowerCase() === searchTrimmed.toLowerCase()
  );

    const addCustom = () => {
    if (!allowCustom || !searchTrimmed || value.includes(searchTrimmed)) return;
    onChange([...value, searchTrimmed]);
    onAddCustom?.(searchTrimmed);   // ← add this
    setSearch("");
    };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        toggleValue(filtered[0]);
        setSearch("");
      } else {
        addCustom();
      }
    }
  };

  return (
    <div className={`app-multiselect__wrapper ${className}`} ref={wrapperRef}>
      <div
        className={`app-multiselect__field
          ${error ? "app-multiselect__field--error" : ""}
          ${open ? "app-multiselect__field--focused" : ""}
          ${open && dropdownPosition === "above" ? "app-multiselect__field--focused-above" : ""}
        `}
      >
        <button
          type="button"
          className="app-multiselect__trigger"
          onClick={handleToggle}
          disabled={disabled}
        >
          <span className={`app-multiselect__value ${value.length === 0 ? "app-multiselect__value--empty" : ""}`}>
            {value.length > 0 ? `${value.length} selected` : "\u00A0"}
          </span>
        </button>

        {label && (
          <label className={`app-multiselect__label ${isFloating ? "app-multiselect__label--float" : ""}`}>
            {label}
          </label>
        )}

        <span className={`app-multiselect__arrow ${open ? "app-multiselect__arrow--open" : ""}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {open && (
        <div className={`app-multiselect__dropdown ${dropdownPosition === "above" ? "app-multiselect__dropdown--above" : ""}`}>
          <input
            autoFocus
            type="text"
            className="app-multiselect__search"
            placeholder={allowCustom ? "Search or add new..." : "Search..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="app-multiselect__options">
            {filtered.length === 0 && (
              <div className="app-multiselect__option app-multiselect__option--empty">No matches</div>
            )}
            {filtered.map((o) => {
              const active = value.includes(o);
              return (
                <div
                  key={o}
                  className={`app-multiselect__option ${active ? "app-multiselect__option--active" : ""}`}
                  onClick={() => toggleValue(o)}
                >
                  {active && <span className="app-multiselect__check">✓</span>}
                  {o}
                </div>
              );
            })}

            {allowCustom && searchTrimmed && !exactMatch && (
              <div className="app-multiselect__option app-multiselect__option--add" onClick={addCustom}>
                <FontAwesomeIcon icon={faPlus} />
                Add "{searchTrimmed}"
              </div>
            )}
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="app-multiselect__chips">
          {value.map((v, i) => (
            <span key={i} className="app-multiselect__chip">
              {v}
              <button
                type="button"
                className="app-multiselect__chip-remove"
                onClick={() => removeChip(i)}
                aria-label={`Remove ${v}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <p className={`app-multiselect__error ${error ? "app-multiselect__error--visible" : ""}`}>
        {error || "\u00A0"}
      </p>
    </div>
  );
}