import { createPortal } from "react-dom";
import "./ConfirmModal.css";

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // danger | warning | default
}) {
  if (!message) return null;

  return createPortal(
    <div className="confirm-modal__backdrop" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal__icon confirm-modal__icon--${variant}`}>
          {variant === "danger" && <i className="ti ti-trash" />}
          {variant === "warning" && <i className="ti ti-alert-triangle" />}
          {variant === "default" && <i className="ti ti-help-circle" />}
        </div>

        <p className="confirm-modal__message">{message}</p>

        <div className="confirm-modal__actions">
          <button className="confirm-modal__btn confirm-modal__btn--cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={`confirm-modal__btn confirm-modal__btn--${variant}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}