import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./AppModal.css";

function AppModal({ isOpen, onClose, title, subtitle, children, maxWidth = "420px" }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  // renders OUTSIDE #root so body blur doesn't affect the modal
  return createPortal(
    <div className="app-modal__overlay" onClick={onClose}>
      <div
        className="app-modal__card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle) && (
          <div className="app-modal__header">
            {title    && <h2 className="app-modal__title">{title}</h2>}
            {subtitle && <p  className="app-modal__subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="app-modal__body">{children}</div>
      </div>
    </div>,
    document.body   // mounts directly on body, sibling to #root
  );
}

export default AppModal;