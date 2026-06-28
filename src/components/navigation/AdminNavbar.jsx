import React from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faBars } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/image.png"; // ✅ same logo as public
import "./AdminNavbar.css";

export default function AdminNavbar({ onMenuToggle }) {
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminUsername");
    window.location.href = "#/login";
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="navbar-logo">
          <img src={logo} alt="Dental Clinic Logo" />
          <span>Admin Portal</span>
        </div>
      </div>

      <div className="navbar-actions">
        <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </nav>
  );
}