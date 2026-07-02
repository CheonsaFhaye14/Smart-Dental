import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faVenusMars,
  faTriangleExclamation,
  faNotesMedical,
  faClock,
  faPen,
  faLock,
  faLockOpen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Badge from "../../../components/ui/Badge";
import "./UserDetails.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
    " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const today = new Date();
  const dob = new Date(birthdate);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

export default function UserDetails({
  user,
  onClose,
  onEdit,         // ✅ new
  onDelete,       // ✅ new
  onToggleActive, // ✅ new
}) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!user) return null;

  const age = calculateAge(user.birthdate);
  const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();

  const allergies = Array.isArray(user.allergies)
    ? user.allergies
    : (user.allergies ? Object.values(user.allergies) : []);

  const medicalHistory = Array.isArray(user.medicalhistory)
    ? user.medicalhistory
    : (user.medicalhistory ? Object.values(user.medicalhistory) : []);

  return (
    <>
      <div className="user-details__backdrop" onClick={onClose} />

      <aside className="user-details__panel">

        {/* Header */}
        <div className="user-details__header">
          <button className="user-details__close" onClick={onClose} aria-label="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="user-details__avatar">
            {user.profile_image && user.profile_image !== "default_profile.png" ? (
              <img src={user.profile_image} alt={`${user.firstname} ${user.lastname}`} />
            ) : (
              <span>{initials || "?"}</span>
            )}
          </div>

          <h2 className="user-details__name">
            {user.firstname} {user.lastname}
          </h2>
          <span className="user-details__username">@{user.username}</span>

          <div className="user-details__badges">
            <Badge variant={user.role}>{user.role}</Badge>
            <Badge variant={user.is_active ? "active" : "inactive"}>
              {user.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="user-details__body">

          {/* Contact */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Contact Information</h3>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faEnvelope} className="user-details__icon" />
              <div>
                <span className="user-details__label">Email</span>
                <span className="user-details__value">{user.email || "—"}</span>
              </div>
            </div>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faPhone} className="user-details__icon" />
              <div>
                <span className="user-details__label">Contact Number</span>
                <span className="user-details__value">{user.contact || "—"}</span>
              </div>
            </div>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="user-details__icon" />
              <div>
                <span className="user-details__label">Address</span>
                <span className="user-details__value">{user.address || "—"}</span>
              </div>
            </div>
          </section>

          {/* Personal */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Personal Details</h3>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faCalendarAlt} className="user-details__icon" />
              <div>
                <span className="user-details__label">Birthdate</span>
                <span className="user-details__value">
                  {formatDate(user.birthdate)} {age !== null && `(${age} yrs old)`}
                </span>
              </div>
            </div>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faVenusMars} className="user-details__icon" />
              <div>
                <span className="user-details__label">Gender</span>
                <span className="user-details__value">{user.gender || "—"}</span>
              </div>
            </div>
          </section>

          {/* Medical — only for patients */}
          {user.role === "patient" && (
            <section className="user-details__section">
              <h3 className="user-details__section-title">Medical Information</h3>

              <div className="user-details__row">
                <FontAwesomeIcon icon={faTriangleExclamation} className="user-details__icon user-details__icon--warning" />
                <div className="user-details__full">
                  <span className="user-details__label">Allergies</span>
                  {allergies.length > 0 ? (
                    <div className="user-details__chips">
                      {allergies.map((a, i) => (
                        <span key={i} className="user-details__chip user-details__chip--warning">
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="user-details__value">None reported</span>
                  )}
                </div>
              </div>

              <div className="user-details__row">
                <FontAwesomeIcon icon={faNotesMedical} className="user-details__icon" />
                <div className="user-details__full">
                  <span className="user-details__label">Medical History</span>
                  {medicalHistory.length > 0 ? (
                    <div className="user-details__chips">
                      {medicalHistory.map((m, i) => (
                        <span key={i} className="user-details__chip">
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="user-details__value">None reported</span>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Account info */}
          <section className="user-details__section">
            <h3 className="user-details__section-title">Account Information</h3>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faClock} className="user-details__icon" />
              <div>
                <span className="user-details__label">Member Since</span>
                <span className="user-details__value">{formatDateTime(user.created_at)}</span>
              </div>
            </div>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faClock} className="user-details__icon" />
              <div>
                <span className="user-details__label">Last Updated</span>
                <span className="user-details__value">{formatDateTime(user.updated_at)}</span>
              </div>
            </div>

            <div className="user-details__row">
              <FontAwesomeIcon icon={faUser} className="user-details__icon" />
              <div>
                <span className="user-details__label">User ID</span>
                <span className="user-details__value user-details__value--mono">{user.id}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ✅ Footer actions */}
        {(onEdit || onToggleActive || onDelete) && (
          <div className="user-details__footer">
            {onEdit && (
              <button
                className="user-details__action user-details__action--edit"
                onClick={() => onEdit(user)}
              >
                <FontAwesomeIcon icon={faPen} /> Edit
              </button>
            )}

            {onToggleActive && (
              <button
                className={`user-details__action ${user.is_active ? "user-details__action--warning" : "user-details__action--success"}`}
                onClick={() => onToggleActive(user)}
              >
                <FontAwesomeIcon icon={user.is_active ? faLock : faLockOpen} />
                {user.is_active ? "Deactivate" : "Activate"}
              </button>
            )}

            {onDelete && (
              <button
                className="user-details__action user-details__action--danger"
                onClick={() => onDelete(user)}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}