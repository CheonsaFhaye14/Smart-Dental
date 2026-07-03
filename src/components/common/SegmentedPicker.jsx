import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SegmentedPicker.css";

/**
 * SegmentedPicker
 * Row of pill buttons, single-select.
 *
 * @param {string} label
 * @param {*} value - currently selected value
 * @param {(val: *) => void} onChange
 * @param {{value:*, label:string, icon?:object, variant?:"success"|"danger"}[]} options
 */
export default function SegmentedPicker({ label, value, onChange, options = [] }) {
  return (
    <div className="segmented-picker__wrapper">
      {label && <span className="segmented-picker__label">{label}</span>}
      <div className="segmented-picker__row">
        {options.map((opt) => {
          const active = value === opt.value;
          const variantClass = opt.variant
            ? `segmented-picker__btn--active-${opt.variant}`
            : "segmented-picker__btn--active";
          return (
            <button
              key={String(opt.value)}
              type="button"
              className={`segmented-picker__btn ${active ? variantClass : ""}`}
              onClick={() => onChange(opt.value)}
            >
              {opt.icon && <FontAwesomeIcon icon={opt.icon} />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}