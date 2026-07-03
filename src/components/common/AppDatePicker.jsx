import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import "./AppDatePicker.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad = (n) => String(n).padStart(2, "0");
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

const parseISO = (str) => {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
};

const isSameDate = (a, b) =>
  a && b && a.year === b.year && a.month === b.month && a.day === b.day;

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const buildDayGrid = (year, month) => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const total = daysInMonth(year, month);
  const prevTotal = daysInMonth(year, month - 1 < 0 ? 11 : month - 1);
  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevTotal - i, inMonth: false, offset: -1 });
  }
  for (let d = 1; d <= total; d++) {
    cells.push({ day: d, inMonth: true, offset: 0 });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: cells.length - (firstWeekday + total) + 1, inMonth: false, offset: 1 });
  }
  return cells;
};

export default function AppDatePicker({
  label,
  value,           // "YYYY-MM-DD" | ""
  onChange,         // (isoString) => void
  error,
  disabled = false,
  minDate,          // optional "YYYY-MM-DD"
  maxDate,          // optional "YYYY-MM-DD"
  className = "",
}) {
  const selected = parseISO(value);
  const today = new Date();
  const todayParts = { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };

  const [open, setOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState("below"); // "below" | "above"
  const [viewMode, setViewMode] = useState("days"); // "days" | "months" | "years"
  const [viewYear, setViewYear] = useState(selected?.year || todayParts.year);
  const [viewMonth, setViewMonth] = useState(selected?.month ?? todayParts.month);
  const [decadeStart, setDecadeStart] = useState(
    Math.floor((selected?.year || todayParts.year) / 12) * 12
  );

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setViewMode("days");
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setViewMode("days");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const minParts = parseISO(minDate);
  const maxParts = parseISO(maxDate);

  const isDisabledDay = (year, month, day) => {
    const t = year * 10000 + month * 100 + day;
    if (minParts) {
      const min = minParts.year * 10000 + minParts.month * 100 + minParts.day;
      if (t < min) return true;
    }
    if (maxParts) {
      const max = maxParts.year * 10000 + maxParts.month * 100 + maxParts.day;
      if (t > max) return true;
    }
    return false;
  };

  const toggleOpen = () => {
    if (disabled) return;
    if (!open) {
      setViewYear(selected?.year || todayParts.year);
      setViewMonth(selected?.month ?? todayParts.month);
      setDecadeStart(Math.floor((selected?.year || todayParts.year) / 12) * 12);
      setViewMode("days");

      // measure available space and flip the popup upward if it won't fit below
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const estimatedPopupHeight = 340;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setPopupPosition(
          spaceBelow < estimatedPopupHeight && spaceAbove > spaceBelow
            ? "above"
            : "below"
        );
      }
    }
    setOpen((o) => !o);
  };

  const selectDay = (year, month, day) => {
    if (isDisabledDay(year, month, day)) return;
    onChange?.(toISO(year, month, day));
    setOpen(false);
    setViewMode("days");
  };

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const displayText = selected
    ? `${MONTHS[selected.month]} ${selected.day}, ${selected.year}`
    : "";
  const isFloating = open || !!displayText;

  const dayCells = buildDayGrid(viewYear, viewMonth);

  return (
    <div className={`date-picker__wrapper ${className}`} ref={wrapperRef}>
      <div
        className={`date-picker__field ${error ? "date-picker__field--error" : ""} ${open ? "date-picker__field--focused" : ""} ${disabled ? "date-picker__field--disabled" : ""}`}
        onClick={toggleOpen}
      >
        <span className="date-picker__display">{displayText || "\u00A0"}</span>

        {label && (
          <label className={`date-picker__label ${isFloating ? "date-picker__label--float" : ""}`}>
            {label}
          </label>
        )}

        <span className="date-picker__icon">
          <FontAwesomeIcon icon={faCalendarDays} />
        </span>
      </div>

      <p className={`date-picker__error ${error ? "date-picker__error--visible" : ""}`}>
        {error || "\u00A0"}
      </p>

      {open && (
        <div
          className={`date-picker__popup ${popupPosition === "above" ? "date-picker__popup--above" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {viewMode === "days" && (
            <>
              <div className="date-picker__header">
                <button type="button" className="date-picker__nav" onClick={() => setViewYear((y) => y - 1)}>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button type="button" className="date-picker__nav" onClick={goPrevMonth}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="button"
                  className="date-picker__title"
                  onClick={() => setViewMode("months")}
                >
                  {MONTHS[viewMonth]} {viewYear}
                </button>
                <button type="button" className="date-picker__nav" onClick={goNextMonth}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button type="button" className="date-picker__nav" onClick={() => setViewYear((y) => y + 1)}>
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
              </div>

              <div className="date-picker__weekdays">
                {WEEKDAYS.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>

              <div className="date-picker__grid">
                {dayCells.map((cell, i) => {
                  const cellYear = viewYear + (viewMonth + cell.offset < 0 ? -1 : viewMonth + cell.offset > 11 ? 1 : 0);
                  const cellMonth = ((viewMonth + cell.offset) % 12 + 12) % 12;
                  const isToday = isSameDate({ year: cellYear, month: cellMonth, day: cell.day }, todayParts);
                  const isSelected = isSameDate({ year: cellYear, month: cellMonth, day: cell.day }, selected);
                  const disabledDay = isDisabledDay(cellYear, cellMonth, cell.day);

                  return (
                    <button
                      type="button"
                      key={i}
                      disabled={disabledDay}
                      className={[
                        "date-picker__day",
                        !cell.inMonth && "date-picker__day--muted",
                        isToday && "date-picker__day--today",
                        isSelected && "date-picker__day--selected",
                        disabledDay && "date-picker__day--disabled",
                      ].filter(Boolean).join(" ")}
                      onClick={() => selectDay(cellYear, cellMonth, cell.day)}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === "months" && (
            <>
              <div className="date-picker__header">
                <button type="button" className="date-picker__nav" onClick={() => setViewYear((y) => y - 1)}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="button"
                  className="date-picker__title"
                  onClick={() => setViewMode("years")}
                >
                  {viewYear}
                </button>
                <button type="button" className="date-picker__nav" onClick={() => setViewYear((y) => y + 1)}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>

              <div className="date-picker__grid date-picker__grid--months">
                {MONTHS.map((m, idx) => (
                  <button
                    type="button"
                    key={m}
                    className={`date-picker__cell ${idx === viewMonth ? "date-picker__cell--selected" : ""}`}
                    onClick={() => { setViewMonth(idx); setViewMode("days"); }}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {viewMode === "years" && (
            <>
              <div className="date-picker__header">
                <button type="button" className="date-picker__nav" onClick={() => setDecadeStart((d) => d - 12)}>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <span className="date-picker__title date-picker__title--static">
                  {decadeStart} – {decadeStart + 11}
                </span>
                <button type="button" className="date-picker__nav" onClick={() => setDecadeStart((d) => d + 12)}>
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
              </div>

              <div className="date-picker__grid date-picker__grid--months">
                {Array.from({ length: 12 }, (_, i) => decadeStart + i).map((y) => (
                  <button
                    type="button"
                    key={y}
                    className={`date-picker__cell ${y === viewYear ? "date-picker__cell--selected" : ""}`}
                    onClick={() => { setViewYear(y); setViewMode("months"); }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}