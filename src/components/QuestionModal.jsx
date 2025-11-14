import React from "react";
import "./QuestionModal.css";

const QuestionModal = ({ isOpen, question, choices = [], onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="qm-overlay">
      <div className="qm-modal">
        <h3>{question}</h3>

        <div className="qm-btn-container">
          {choices.map((choice, index) => (
            <button
              key={index}
              className="qm-choice-btn"
              onClick={() => onSelect(choice)}
            >
              {choice}
            </button>
          ))}
        
        <button className="qm-close-btn" onClick={onClose}>
          Cancel
        </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
