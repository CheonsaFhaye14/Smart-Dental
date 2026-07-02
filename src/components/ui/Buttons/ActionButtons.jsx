import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./ActionButtons.css";

function ActionButtons({ row, actions = [] }) {
  const visibleActions = actions.filter((a) => !a.hidden);

  if (visibleActions.length === 0) return null;

  return (
    <div className="action-buttons">
      {visibleActions.map((action) => (
        <button
          key={action.key}
          type="button"
          className={`action-btn action-btn--${action.variant || "default"}`}
          onClick={() => action.onClick(row)}
          disabled={action.disabled || action.loading}
          title={action.label}           // still shows on hover even if no visible label
          aria-label={action.label}      // still accessible even if no visible label
        >
          {action.loading ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : action.icon ? (
            <FontAwesomeIcon icon={action.icon} />
          ) : null}
          {action.label && (             /* ← only renders text if label was passed */
            <span className="action-btn__label">{action.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default ActionButtons;