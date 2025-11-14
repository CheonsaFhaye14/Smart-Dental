import React from "react"; 
import FloatingInput from "../utils/InputForm"; 
import { formatDateTime } from "../utils/formatDateTime"; 

const ShowInfoModal = ({ row, onClose }) => {
  if (!row) return null;

  // Filter out null/undefined, id, is_deleted, and any function fields (like onEdit/onDelete)
const displayedFields = Object.entries(row).filter(
  ([key, value]) =>
    value !== null &&
    value !== undefined &&
    value !== "" && // <-- hide empty strings
    value.toString().trim() !== "" && // <-- hide whitespace-only values
    key !== "id" &&
    key !== "is_deleted" &&
    typeof value !== "function"
);

  const capitalizeWords = (str) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const fullName = capitalizeWords(`${row.firstname || ""} ${row.lastname || ""}`.trim()) || "User Info";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content show-info-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="modal-title"
          style={{ fontSize: "2rem", textAlign: "center", marginBottom: "1.5rem" }}
        >
          {fullName}'s Information
        </h2>

        <div className="modal-body">
          {displayedFields.map(([key, value]) => (
            <div className="input-container" key={key}>
              <FloatingInput
                name={key}
value={
 key === "created_at" || key === "updated_at"
  ? formatDateTime(value)
  : key === "birthdate"
  ? new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  : key === "gender"
  ? capitalizeWords(value.toString())
  : value.toString()
}
                placeholder={capitalizeWords(key)}
disabled={true}
              />
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowInfoModal;
