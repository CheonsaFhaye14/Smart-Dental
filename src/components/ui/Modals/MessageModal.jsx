import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./MessageModal.css";

const ICONS = {
  info: "ti-info-circle",
  error: "ti-alert-circle",
  success: "ti-circle-check",
};

function MessageModal({ message, type = "info", onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 2200);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return createPortal(
    <div className="toast-wrapper">
      <div className={`toast toast--${type}`}>
        <i className={`ti ${ICONS[type] || ICONS.info} toast__icon`} aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>,
    document.body
  );
}

export default MessageModal;