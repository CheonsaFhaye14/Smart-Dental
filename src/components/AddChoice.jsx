import React from "react";
import "./AddChoice.css";

export default function AddChoice({ choices, onSelect }) {
  return (
    <div className="add-choice-container">
      <div className="add-choice-dropdown">
        {choices.map((choice) => (
          <div
            key={choice}
            className="add-choice-item"
            onClick={() => onSelect(choice)}
          >
            {choice}
          </div>
        ))}
      </div>
    </div>
  );
}

